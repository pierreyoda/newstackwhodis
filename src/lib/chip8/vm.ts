import { Chip8Keypad } from "./keypad";
import { Chip8Display, FONT_SET } from "./display";
import { instructionFromOpcode } from "./instructions";
import type { Chip8DisassembledInstruction } from "./instructions";

export interface Chip8VirtualMachineData {
  /** 4KB of RAM (4096 bytes), from 0x000 to 0xFFF. */
  memory: Uint8Array;
  /** 16 8-bit registers (V0 to VF, VF being a flag register). */
  registers: Uint8Array;
  /** Subroutines address stack (16 16-bit values). */
  stack: Uint16Array;
  /** The stack pointer (8 bits) points to the top level of the stack. */
  sp: number;
  /** Index register nibble (4 bits). */
  i: number;
  /** The program counter (8 bits) is the memory address of the current instruction. */
  pc: number;
  /** Sound timer (8 bits). */
  ST: number;
  /** Delay timer (8 bits). */
  DT: number;
  /**
   * Implementation option.
   *
   * Should the shifting opcodes 8XY6 and 8XYE use the original implementation,
   * i.e. set VX to VY shifted respectively right and left by one bit ?
   * If false, the VM will instead consider as many ROMs seem to do that Y=X.
   * See http://mattmik.com/chip8.html for more detail.
   */
  shouldShiftOpcodeUseVY: boolean;
  /**
   * If defined, points to the register where the next, awaited for key press
   * index is to be saved.
   */
  waitingForKeyRegisterIndex: number | null;
}

export interface Chip8ExecutionContext {
  onWaitingForKey: () => void;
}

// TODO: we can't use the new "#" private method syntax due to Svelte's compiler not supporting it currently
export class Chip8VirtualMachine {
  data: Chip8VirtualMachineData = initChip8VirtualMachineData();
  display: Chip8Display = new Chip8Display();
  keypad: Chip8Keypad = new Chip8Keypad();

  constructor(private context?: Chip8ExecutionContext) {}

  reset() {
    this.data = initChip8VirtualMachineData();
    this.display.clear();
  }

  loadROM(rom: Uint8Array) {
    this.reset();
    // the original CHIP-8 interpreters used [0x00..0x200] to store themselves
    const memoryStart = 0x200;
    this.data.memory.set(rom, memoryStart);
  }

  setShouldShiftOpcodeUseVY(shouldShiftOpcodeUseVY: boolean) {
    this.data.shouldShiftOpcodeUseVY = shouldShiftOpcodeUseVY;
  }

  /** Timers handling. Must be called at 60Hz. */
  tick() {
    if (this.data.DT > 0) {
      --this.data.DT;
    }
    if (this.data.ST > 0) {
      --this.data.DT;
    }
  }

  endWaitingForKey(keyIndex: number) {
    if (!this.data.waitingForKeyRegisterIndex) {
      console.warn("Chip8VM: called endWaitingForKey without pending key state.");
      return;
    }
    this.data.registers[this.data.waitingForKeyRegisterIndex] = keyIndex;
    this.data.waitingForKeyRegisterIndex = null;
    this.data.pc += 2;
  }

  step() {
    // fetch (NB: big-endian)
    const opcode = (this.data.memory[this.data.pc] << 8) | this.data.memory[this.data.pc + 1];
    // decode and execute
    this.executeOpcode(opcode);
  }

  executeOpcode(opcode: number) {
    const decodedInstruction = instructionFromOpcode(opcode);
    if (!decodedInstruction) {
      console.warn(`Chip8VirtualMachine: unknown opcode "${opcode.toString(16)}" at "${this.data.pc.toString(16)}".`);
      return;
    }

    // TODO: can we reduce boilerplate here? inference seems to break
    if (decodedInstruction.id === "CLS") {
      this._clearScreen();
    } else if (decodedInstruction.id === "RET") {
      this._return();
    } else if (decodedInstruction.id === "JP_ADDR") {
      const { parameters } = decodedInstruction as Chip8DisassembledInstruction<"JP_ADDR">;
      this._jumpAddress(parameters[0].address);
    } else if (decodedInstruction.id === "CALL_ADDR") {
      const { parameters } = decodedInstruction as Chip8DisassembledInstruction<"CALL_ADDR">;
      this._callAddress(parameters[0].address);
    } else if (decodedInstruction.id === "SE_VX_NN") {
      const { parameters } = decodedInstruction as Chip8DisassembledInstruction<"SE_VX_NN">;
      this._skipIfVxEqualsNN(parameters[0].registerIndex, parameters[1].byte);
    } else if (decodedInstruction.id === "SNE_VX_NN") {
      const { parameters } = decodedInstruction as Chip8DisassembledInstruction<"SNE_VX_NN">;
      this._skipIfVxDoesNotEqualNN(parameters[0].registerIndex, parameters[1].byte);
    } else if (decodedInstruction.id === "SE_VX_VY") {
      const { parameters } = decodedInstruction as Chip8DisassembledInstruction<"SE_VX_VY">;
      this._skipIfVxEqualsVy(parameters[0].registerIndex, parameters[1].registerIndex);
    } else if (decodedInstruction.id === "LD_VX_NN") {
      const { parameters } = decodedInstruction as Chip8DisassembledInstruction<"LD_VX_NN">;
      this._loadVxNN(parameters[0].registerIndex, parameters[1].byte);
    } else if (decodedInstruction.id === "ADD_VX_NN") {
      const { parameters } = decodedInstruction as Chip8DisassembledInstruction<"LD_VX_NN">;
      this._addVxNN(parameters[0].registerIndex, parameters[1].byte);
    } else if (decodedInstruction.id === "LD_VX_VY") {
      const { parameters } = decodedInstruction as Chip8DisassembledInstruction<"LD_VX_VY">;
      this._loadVxVy(parameters[0].registerIndex, parameters[1].registerIndex);
    } else if (decodedInstruction.id === "OR_VX_VY") {
      const { parameters } = decodedInstruction as Chip8DisassembledInstruction<"OR_VX_VY">;
      this._orVxVy(parameters[0].registerIndex, parameters[1].registerIndex);
    } else if (decodedInstruction.id === "AND_VX_VY") {
      const { parameters } = decodedInstruction as Chip8DisassembledInstruction<"AND_VX_VY">;
      this._andVxVy(parameters[0].registerIndex, parameters[1].registerIndex);
    } else if (decodedInstruction.id === "XOR_VX_VY") {
      const { parameters } = decodedInstruction as Chip8DisassembledInstruction<"XOR_VX_VY">;
      this._xorVxVy(parameters[0].registerIndex, parameters[1].registerIndex);
    } else if (decodedInstruction.id === "ADD_VX_VY") {
      const { parameters } = decodedInstruction as Chip8DisassembledInstruction<"ADD_VX_VY">;
      this._addVxVy(parameters[0].registerIndex, parameters[1].registerIndex);
    } else if (decodedInstruction.id === "SUB_VX_VY") {
      const { parameters } = decodedInstruction as Chip8DisassembledInstruction<"SUB_VX_VY">;
      this._subVxVy(parameters[0].registerIndex, parameters[1].registerIndex);
    } else if (decodedInstruction.id === "SHR_VX_VY") {
      const { parameters } = decodedInstruction as Chip8DisassembledInstruction<"SHR_VX_VY">;
      this._shiftRightVxVy(parameters[0].registerIndex, parameters[1].registerIndex);
    } else if (decodedInstruction.id === "SUBN_VX_VY") {
      const { parameters } = decodedInstruction as Chip8DisassembledInstruction<"SUBN_VX_VY">;
      this._subnVxVy(parameters[0].registerIndex, parameters[1].registerIndex);
    } else if (decodedInstruction.id === "SHL_VX_VY") {
      const { parameters } = decodedInstruction as Chip8DisassembledInstruction<"SHL_VX_VY">;
      this._shiftLeftVxVy(parameters[0].registerIndex, parameters[1].registerIndex);
    } else if (decodedInstruction.id === "SNE_VX_VY") {
      const { parameters } = decodedInstruction as Chip8DisassembledInstruction<"SNE_VX_VY">;
      this._skipIfVxDoesNotEqualVy(parameters[0].registerIndex, parameters[1].registerIndex);
    } else if (decodedInstruction.id === "LD_I_ADDR") {
      const { parameters } = decodedInstruction as Chip8DisassembledInstruction<"LD_I_ADDR">;
      this._loadIAddress(parameters[0].address);
    } else if (decodedInstruction.id === "JP_ADDR_V0") {
      const { parameters } = decodedInstruction as Chip8DisassembledInstruction<"JP_ADDR_V0">;
      const address = parameters[0].address + this.data.registers[0];
      this._jumpAddress(address);
    } else if (decodedInstruction.id === "RND_VX_NN") {
      const { parameters } = decodedInstruction as Chip8DisassembledInstruction<"RND_VX_NN">;
      this._randomVxNN(parameters[0].registerIndex, parameters[1].byte);
    } else if (decodedInstruction.id === "DRW_VX_VY_N") {
      const { parameters } = decodedInstruction as Chip8DisassembledInstruction<"DRW_VX_VY_N">;
      this._drawVxVyN(parameters[0].registerIndex, parameters[1].registerIndex, parameters[2].nibble);
    } else if (decodedInstruction.id === "SKP_VX") {
      const { parameters } = decodedInstruction as Chip8DisassembledInstruction<"SKP_VX">;
      this._skipIfVxKey(parameters[0].registerIndex);
    } else if (decodedInstruction.id === "SKNP_VX") {
      const { parameters } = decodedInstruction as Chip8DisassembledInstruction<"SKNP_VX">;
      this._skipIfNotVxKey(parameters[0].registerIndex);
    } else if (decodedInstruction.id === "LD_VX_DT") {
      const { parameters } = decodedInstruction as Chip8DisassembledInstruction<"LD_VX_DT">;
      this._loadVxDt(parameters[0].registerIndex);
    } else if (decodedInstruction.id === "LD_VX_KEY") {
      const { parameters } = decodedInstruction as Chip8DisassembledInstruction<"LD_VX_KEY">;
      this._loadVxKey(parameters[0].registerIndex);
    } else if (decodedInstruction.id === "LD_DT_VX") {
      const { parameters } = decodedInstruction as Chip8DisassembledInstruction<"LD_DT_VX">;
      this._loadDtVx(parameters[0].registerIndex);
    } else if (decodedInstruction.id === "LD_ST_VX") {
      const { parameters } = decodedInstruction as Chip8DisassembledInstruction<"LD_ST_VX">;
      this._loadStVx(parameters[0].registerIndex);
    } else if (decodedInstruction.id === "ADD_I_VX") {
      const { parameters } = decodedInstruction as Chip8DisassembledInstruction<"ADD_I_VX">;
      this._addIVx(parameters[0].registerIndex);
    } else if (decodedInstruction.id === "LD_I_FONT_VX") {
      const { parameters } = decodedInstruction as Chip8DisassembledInstruction<"LD_I_FONT_VX">;
      this._loadIFontVx(parameters[0].registerIndex);
    } else if (decodedInstruction.id === "LD_MEM_I_BCD_VX") {
      const { parameters } = decodedInstruction as Chip8DisassembledInstruction<"LD_MEM_I_BCD_VX">;
      this._loadMemoryIBcdVx(parameters[0].registerIndex);
    } else if (decodedInstruction.id === "LD_MEM_I_REGS") {
      const { parameters } = decodedInstruction as Chip8DisassembledInstruction<"LD_MEM_I_REGS">;
      this._loadMemoryIRegisters(parameters[0].registerIndex);
    } else if (decodedInstruction.id === "LD_REGS_MEM_I") {
      const { parameters } = decodedInstruction as Chip8DisassembledInstruction<"LD_REGS_MEM_I">;
      this._loadRegistersMemoryI(parameters[0].registerIndex);
    }
  }

  _clearScreen() {
    this.display.clear();
    this.data.pc += 2;
  }

  _return() {
    const address = this.data.stack[--this.data.sp];
    this._jumpAddress(address);
    this.data.pc += 2;
  }

  _jumpAddress(nnn: number) {
    this.data.pc = nnn;
  }

  _callAddress(nnn: number) {
    this.data.stack[this.data.sp++] = this.data.pc;
    this._jumpAddress(nnn);
  }

  _skipIfVxEqualsNN(x: number, nn: number) {
    this.data.pc += this.data.registers[x] === nn ? 4 : 2;
  }
  _skipIfVxDoesNotEqualNN(x: number, nn: number) {
    this.data.pc += this.data.registers[x] !== nn ? 4 : 2;
  }
  _skipIfVxEqualsVy(x: number, y: number) {
    this.data.pc += this.data.registers[x] === this.data.registers[y] ? 4 : 2;
  }
  _skipIfVxDoesNotEqualVy(x: number, y: number) {
    this.data.pc += this.data.registers[x] !== this.data.registers[y] ? 4 : 2;
  }
  _skipIfVxKey(x: number) {
    this.data.pc += this.keypad.isKeyPressed(this.data.registers[x]) ? 4 : 2;
  }
  _skipIfNotVxKey(x: number) {
    this.data.pc += this.keypad.isKeyPressed(this.data.registers[x]) ? 2 : 4;
  }

  _loadVxNN(x: number, nn: number) {
    this.data.registers[x] = nn;
    this.data.pc += 2;
  }
  _loadVxVy(x: number, y: number) {
    this.data.registers[x] = this.data.registers[y];
    this.data.pc += 2;
  }
  _loadVxDt(x: number) {
    this.data.registers[x] = this.data.DT;
    this.data.pc += 2;
  }
  _loadDtVx(x: number) {
    this.data.DT = this.data.registers[x];
    this.data.pc += 2;
  }
  _loadStVx(x: number) {
    this.data.ST = this.data.registers[x];
    this.data.pc += 2;
  }
  /**
   * Wait for a key (blocking operation) to be pressed and store it into register VX.
   *
   * Works by notifying the emulation application context the VM is waiting for a key press.
   * Then, that context MUST call `endWaitingForKey`.
   */
  _loadVxKey(x: number) {
    this.data.waitingForKeyRegisterIndex = x;
    this.context?.onWaitingForKey();
    this.data.pc += 2;
  }
  _loadIAddress(nnn: number) {
    this.data.i = nnn;
    this.data.pc += 2;
  }

  /**
   * Set I to the memory address of the sprite data corresponding to the
   * hexadecimal digit (0x0..0xF) stored in register VX.
   *
   * Will use the internal fontset stored in memory.
   */
  _loadIFontVx(x: number) {
    // the font set is in the memory range 0x0..0x80
    // and each character is represented by 5 bytes
    this.data.i = this.data.registers[x] * 5;
    this.data.pc += 2;
  }

  /**
   * Store the Binary-Coded Decimal equivalent of the value stored in
   * register VX in memory at the addresses I, I+1, and I+2.
   */
  _loadMemoryIBcdVx(x: number) {
    const vx = this.data.registers[x];
    this.data.memory[this.data.i] = vx / 100;
    this.data.memory[this.data.i + 1] = (vx / 10) % 10;
    this.data.memory[this.data.i + 2] = (vx % 100) % 10;
    this.data.pc += 2;
  }
  _loadMemoryIRegisters(x: number) {
    for (let j = 0; j <= x; j++) {
      this.data.memory[this.data.i + j] = this.data.registers[j];
    }
    this.data.i += x + 1;
    this.data.pc += 2;
  }
  _loadRegistersMemoryI(x: number) {
    for (let j = 0; j <= x; j++) {
      this.data.registers[j] = this.data.memory[this.data.i + j];
    }
    this.data.pc += 2;
  }

  _randomVxNN(x: number, nn: number) {
    this.data.registers[x] = this._randomIntegerInInclusiveRange(0x00, 0xff) & nn;
    this.data.pc += 2;
  }
  _randomIntegerInInclusiveRange(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min) + min);
  }

  _addVxNN(x: number, nn: number) {
    const value = (this.data.registers[x] + nn) % 256;
    this.data.registers[x] = value;
    this.data.pc += 2;
  }
  _orVxVy(x: number, y: number) {
    this.data.registers[x] |= this.data.registers[y];
    this.data.pc += 2;
  }
  _andVxVy(x: number, y: number) {
    this.data.registers[x] &= this.data.registers[y];
    this.data.pc += 2;
  }
  _xorVxVy(x: number, y: number) {
    this.data.registers[x] ^= this.data.registers[y];
    this.data.pc += 2;
  }
  _addVxVy(x: number, y: number) {
    const value = this.data.registers[x] + this.data.registers[y];
    this.data.registers[x] = value;
    this.data.registers[0xf] = value > 0xff ? 1 : 0;
    this.data.pc += 2;
  }
  _subVxVy(x: number, y: number) {
    const value = this.data.registers[x] - this.data.registers[y];
    this.data.registers[x] = value;
    this.data.registers[0xf] = value < 0 ? 0 : 1;
    this.data.pc += 2;
  }
  _subnVxVy(x: number, y: number) {
    const value = this.data.registers[y] - this.data.registers[x];
    this.data.registers[x] = value;
    this.data.registers[0xf] = value < 0 ? 0 : 1;
    this.data.pc += 2;
  }
  _shiftRightVxVy(x: number, y: number) {
    const shiftOnIndex = this.data.shouldShiftOpcodeUseVY ? y : x;
    this.data.registers[0xf] = this.data.registers[shiftOnIndex] & 0x01;
    this.data.registers[x] = this.data.registers[shiftOnIndex] >> 1;
    this.data.pc += 2;
  }
  _shiftLeftVxVy(x: number, y: number) {
    const shiftOnIndex = this.data.shouldShiftOpcodeUseVY ? y : x;
    this.data.registers[0xf] = (this.data.registers[shiftOnIndex] & 0x80) >> 7;
    this.data.registers[x] = (this.data.registers[shiftOnIndex] << 1) & 0xff;
    this.data.pc += 2;
  }
  _addIVx(x: number) {
    this.data.i += this.data.registers[x];
    this.data.pc += 2;
  }

  /**
   * Draw a sprite at position VX, VY with 0xN bytes of sprite data starting
   * at the address stored in I, where N is the height of the sprite.
   *
   * The drawing itself is implemented in the `display` module as a XOR operation.
   * VF will act here as a collision flag, i.e. if any set pixel is erased
   * set it to 0x1, and to 0x0 otherwise.
   */
  _drawVxVyN(x: number, y: number, n: number) {
    const [positionX, positionY] = [this.data.registers[x], this.data.registers[y]];
    const [memoryStart, memoryEnd] = [this.data.i, this.data.i + n];
    const sprite = Array.from(this.data.memory.slice(memoryStart, memoryEnd));
    this.data.registers[0xf] = this.display.draw(positionX, positionY, sprite) ? 1 : 0;
    this.data.pc += 2;
  }
}

export const initChip8VirtualMachineData = (): Chip8VirtualMachineData => {
  // init the data with sensible defaults
  const data: Chip8VirtualMachineData = {
    memory: new Uint8Array(4096),
    registers: new Uint8Array(16),
    stack: new Uint16Array(16),
    sp: 0,
    i: 0,
    pc: 0x200,
    ST: 0,
    DT: 0,
    shouldShiftOpcodeUseVY: false,
    waitingForKeyRegisterIndex: null,
  };
  // load the font set into the memory space [0x0..80].
  for (let j = 0; j < FONT_SET.length; j++) {
    data.memory[j] = FONT_SET[j];
  }

  return data;
};
