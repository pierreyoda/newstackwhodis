import { Chip8Keypad } from "./keypad";
import { Chip8Display, FONT_SET } from "./display";
import { Chip8DisassembledInstruction, instructionFromOpcode } from "./instructions";

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

export class Chip8VirtualMachine {
  data: Chip8VirtualMachineData = initChip8VirtualMachineData();
  display: Chip8Display = new Chip8Display();
  keypad: Chip8Keypad = new Chip8Keypad();

  constructor(private context?: Chip8ExecutionContext) {}

  reset() {
    this.data = initChip8VirtualMachineData();
    this.display.clear();
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
      this.#clearScreen();
    } else if (decodedInstruction.id === "RET") {
      this.#return();
    } else if (decodedInstruction.id === "JP_ADDR") {
      const { parameters } = decodedInstruction as Chip8DisassembledInstruction<"JP_ADDR">;
      this.#jumpAddress(parameters[0].address);
    } else if (decodedInstruction.id === "CALL_ADDR") {
      const { parameters } = decodedInstruction as Chip8DisassembledInstruction<"CALL_ADDR">;
      this.#callAddress(parameters[0].address);
    } else if (decodedInstruction.id === "SE_VX_NN") {
      const { parameters } = decodedInstruction as Chip8DisassembledInstruction<"SE_VX_NN">;
      this.#skipIfVxEqualsNN(parameters[0].registerIndex, parameters[1].byte);
    } else if (decodedInstruction.id === "SNE_VX_NN") {
      const { parameters } = decodedInstruction as Chip8DisassembledInstruction<"SNE_VX_NN">;
      this.#skipIfVxDoesNotEqualNN(parameters[0].registerIndex, parameters[1].byte);
    } else if (decodedInstruction.id === "SE_VX_VY") {
      const { parameters } = decodedInstruction as Chip8DisassembledInstruction<"SE_VX_VY">;
      this.#skipIfVxEqualsVy(parameters[0].registerIndex, parameters[1].registerIndex);
    } else if (decodedInstruction.id === "LD_VX_NN") {
      const { parameters } = decodedInstruction as Chip8DisassembledInstruction<"LD_VX_NN">;
      this.#loadVxNN(parameters[0].registerIndex, parameters[1].byte);
    } else if (decodedInstruction.id === "ADD_VX_NN") {
      const { parameters } = decodedInstruction as Chip8DisassembledInstruction<"LD_VX_NN">;
      this.#addVxNN(parameters[0].registerIndex, parameters[1].byte);
    } else if (decodedInstruction.id === "LD_VX_VY") {
      const { parameters } = decodedInstruction as Chip8DisassembledInstruction<"LD_VX_VY">;
      this.#loadVxVy(parameters[0].registerIndex, parameters[1].registerIndex);
    } else if (decodedInstruction.id === "OR_VX_VY") {
      const { parameters } = decodedInstruction as Chip8DisassembledInstruction<"OR_VX_VY">;
      this.#orVxVy(parameters[0].registerIndex, parameters[1].registerIndex);
    } else if (decodedInstruction.id === "AND_VX_VY") {
      const { parameters } = decodedInstruction as Chip8DisassembledInstruction<"AND_VX_VY">;
      this.#andVxVy(parameters[0].registerIndex, parameters[1].registerIndex);
    } else if (decodedInstruction.id === "XOR_VX_VY") {
      const { parameters } = decodedInstruction as Chip8DisassembledInstruction<"XOR_VX_VY">;
      this.#xorVxVy(parameters[0].registerIndex, parameters[1].registerIndex);
    } else if (decodedInstruction.id === "ADD_VX_VY") {
      const { parameters } = decodedInstruction as Chip8DisassembledInstruction<"ADD_VX_VY">;
      this.#addVxVy(parameters[0].registerIndex, parameters[1].registerIndex);
    } else if (decodedInstruction.id === "SUB_VX_VY") {
      const { parameters } = decodedInstruction as Chip8DisassembledInstruction<"SUB_VX_VY">;
      this.#subVxVy(parameters[0].registerIndex, parameters[1].registerIndex);
    } else if (decodedInstruction.id === "SHR_VX_VY") {
      const { parameters } = decodedInstruction as Chip8DisassembledInstruction<"SHR_VX_VY">;
      this.#shiftRightVxVy(parameters[0].registerIndex, parameters[1].registerIndex);
    } else if (decodedInstruction.id === "SUBN_VX_VY") {
      const { parameters } = decodedInstruction as Chip8DisassembledInstruction<"SUBN_VX_VY">;
      this.#subnVxVy(parameters[0].registerIndex, parameters[1].registerIndex);
    } else if (decodedInstruction.id === "SHL_VX_VY") {
      const { parameters } = decodedInstruction as Chip8DisassembledInstruction<"SHL_VX_VY">;
      this.#shiftLeftVxVy(parameters[0].registerIndex, parameters[1].registerIndex);
    } else if (decodedInstruction.id === "SNE_VX_VY") {
      const { parameters } = decodedInstruction as Chip8DisassembledInstruction<"SNE_VX_VY">;
      this.#skipIfVxDoesNotEqualVy(parameters[0].registerIndex, parameters[1].registerIndex);
    } else if (decodedInstruction.id === "LD_I_ADDR") {
      const { parameters } = decodedInstruction as Chip8DisassembledInstruction<"LD_I_ADDR">;
      this.#loadIAddress(parameters[0].address);
    } else if (decodedInstruction.id === "JP_ADDR_V0") {
      const { parameters } = decodedInstruction as Chip8DisassembledInstruction<"JP_ADDR_V0">;
      const address = parameters[0].address + this.data.registers[0];
      this.#jumpAddress(address);
    } else if (decodedInstruction.id === "RND_VX_NN") {
      const { parameters } = decodedInstruction as Chip8DisassembledInstruction<"RND_VX_NN">;
      this.#randomVxNN(parameters[0].registerIndex, parameters[1].byte);
    } else if (decodedInstruction.id === "DRW_VX_VY_N") {
      const { parameters } = decodedInstruction as Chip8DisassembledInstruction<"DRW_VX_VY_N">;
      this.#drawVxVyN(parameters[0].registerIndex, parameters[1].registerIndex, parameters[2].nibble);
    } else if (decodedInstruction.id === "SKP_VX") {
      const { parameters } = decodedInstruction as Chip8DisassembledInstruction<"SKP_VX">;
      this.#skipIfVxKey(parameters[0].registerIndex);
    } else if (decodedInstruction.id === "SKNP_VX") {
      const { parameters } = decodedInstruction as Chip8DisassembledInstruction<"SKNP_VX">;
      this.#skipIfNotVxKey(parameters[0].registerIndex);
    } else if (decodedInstruction.id === "LD_VX_DT") {
      const { parameters } = decodedInstruction as Chip8DisassembledInstruction<"LD_VX_DT">;
      this.#loadVxDt(parameters[0].registerIndex);
    } else if (decodedInstruction.id === "LD_VX_KEY") {
      const { parameters } = decodedInstruction as Chip8DisassembledInstruction<"LD_VX_KEY">;
      this.#loadVxKey(parameters[0].registerIndex);
    } else if (decodedInstruction.id === "LD_DT_VX") {
      const { parameters } = decodedInstruction as Chip8DisassembledInstruction<"LD_DT_VX">;
      this.#loadDtVx(parameters[0].registerIndex);
    } else if (decodedInstruction.id === "LD_ST_VX") {
      const { parameters } = decodedInstruction as Chip8DisassembledInstruction<"LD_ST_VX">;
      this.#loadStVx(parameters[0].registerIndex);
    } else if (decodedInstruction.id === "ADD_I_VX") {
      const { parameters } = decodedInstruction as Chip8DisassembledInstruction<"ADD_I_VX">;
      this.#addIVx(parameters[0].registerIndex);
    } else if (decodedInstruction.id === "LD_I_FONT_VX") {
      const { parameters } = decodedInstruction as Chip8DisassembledInstruction<"LD_I_FONT_VX">;
      this.#loadIFontVx(parameters[0].registerIndex);
    } else if (decodedInstruction.id === "LD_MEM_I_BCD_VX") {
      const { parameters } = decodedInstruction as Chip8DisassembledInstruction<"LD_MEM_I_BCD_VX">;
      this.#loadMemoryIBcdVx(parameters[0].registerIndex);
    } else if (decodedInstruction.id === "LD_MEM_I_REGS") {
      const { parameters } = decodedInstruction as Chip8DisassembledInstruction<"LD_MEM_I_REGS">;
      this.#loadMemoryIRegisters(parameters[0].registerIndex);
    } else if (decodedInstruction.id === "LD_REGS_MEM_I") {
      const { parameters } = decodedInstruction as Chip8DisassembledInstruction<"LD_REGS_MEM_I">;
      this.#loadRegistersMemoryI(parameters[0].registerIndex);
    }
  }

  #clearScreen() {
    this.display.clear();
    this.data.pc += 2;
  }

  #return() {
    const address = this.data.stack[--this.data.sp];
    this.#jumpAddress(address);
    this.data.pc += 2;
  }

  #jumpAddress(nnn: number) {
    this.data.pc = nnn;
  }

  #callAddress(nnn: number) {
    this.data.stack[this.data.sp++] = this.data.pc;
    this.#jumpAddress(nnn);
  }

  #skipIfVxEqualsNN(x: number, nn: number) {
    this.data.pc += this.data.registers[x] === nn ? 4 : 2;
  }
  #skipIfVxDoesNotEqualNN(x: number, nn: number) {
    this.data.pc += this.data.registers[x] !== nn ? 4 : 2;
  }
  #skipIfVxEqualsVy(x: number, y: number) {
    this.data.pc += this.data.registers[x] === this.data.registers[y] ? 4 : 2;
  }
  #skipIfVxDoesNotEqualVy(x: number, y: number) {
    this.data.pc += this.data.registers[x] !== this.data.registers[y] ? 4 : 2;
  }
  #skipIfVxKey(x: number) {
    this.data.pc += this.keypad.isKeyPressed(this.data.registers[x]) ? 4 : 2;
  }
  #skipIfNotVxKey(x: number) {
    this.data.pc += this.keypad.isKeyPressed(this.data.registers[x]) ? 2 : 4;
  }

  #loadVxNN(x: number, nn: number) {
    this.data.registers[x] = nn;
    this.data.pc += 2;
  }
  #loadVxVy(x: number, y: number) {
    this.data.registers[x] = this.data.registers[y];
    this.data.pc += 2;
  }
  #loadVxDt(x: number) {
    this.data.registers[x] = this.data.DT;
    this.data.pc += 2;
  }
  #loadDtVx(x: number) {
    this.data.DT = this.data.registers[x];
    this.data.pc += 2;
  }
  #loadStVx(x: number) {
    this.data.ST = this.data.registers[x];
    this.data.pc += 2;
  }
  /**
   * Wait for a key (blocking operation) to be pressed and store it into register VX.
   *
   * Works by notifying the emulation application context the VM is waiting for a key press.
   * Then, that context MUST call `endWaitingForKey`.
   */
  #loadVxKey(x: number) {
    this.data.waitingForKeyRegisterIndex = x;
    this.context?.onWaitingForKey();
    this.data.pc += 2;
  }
  #loadIAddress(nnn: number) {
    this.data.i = nnn;
    this.data.pc += 2;
  }

  /**
   * Set I to the memory address of the sprite data corresponding to the
   * hexadecimal digit (0x0..0xF) stored in register VX.
   *
   * Will use the internal fontset stored in memory.
   */
  #loadIFontVx(x: number) {
    // the font set is in the memory range 0x0..0x80
    // and each character is represented by 5 bytes
    this.data.i = this.data.registers[x] * 5;
    this.data.pc += 2;
  }

  /**
   * Store the Binary-Coded Decimal equivalent of the value stored in
   * register VX in memory at the addresses I, I+1, and I+2.
   */
  #loadMemoryIBcdVx(x: number) {
    const vx = this.data.registers[x];
    this.data.memory[this.data.i] = vx / 100;
    this.data.memory[this.data.i + 1] = (vx / 10) % 10;
    this.data.memory[this.data.i + 2] = (vx % 100) % 10;
    this.data.pc += 2;
  }
  #loadMemoryIRegisters(x: number) {
    for (let j = 0; j <= x; j++) {
      this.data.memory[this.data.i + j] = this.data.registers[j];
    }
    this.data.i += x + 1;
    this.data.pc += 2;
  }
  #loadRegistersMemoryI(x: number) {
    for (let j = 0; j <= x; j++) {
      this.data.registers[j] = this.data.memory[this.data.i + j];
    }
    this.data.pc += 2;
  }

  #randomVxNN(x: number, nn: number) {
    this.data.registers[x] = this.#randomIntegerInInclusiveRange(0x00, 0xff) & nn;
    this.data.pc += 2;
  }
  #randomIntegerInInclusiveRange(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min) + min);
  }

  #addVxNN(x: number, nn: number) {
    const value = (this.data.registers[x] + nn) % 256;
    this.data.registers[x] = value;
    this.data.pc += 2;
  }
  #orVxVy(x: number, y: number) {
    this.data.registers[x] |= this.data.registers[y];
    this.data.pc += 2;
  }
  #andVxVy(x: number, y: number) {
    this.data.registers[x] &= this.data.registers[y];
    this.data.pc += 2;
  }
  #xorVxVy(x: number, y: number) {
    this.data.registers[x] ^= this.data.registers[y];
    this.data.pc += 2;
  }
  #addVxVy(x: number, y: number) {
    const value = this.data.registers[x] + this.data.registers[y];
    this.data.registers[x] = value;
    this.data.registers[0xf] = value > 0xff ? 1 : 0;
    this.data.pc += 2;
  }
  #subVxVy(x: number, y: number) {
    const value = this.data.registers[x] - this.data.registers[y];
    this.data.registers[x] = value;
    this.data.registers[0xf] = value < 0 ? 1 : 0;
    this.data.pc += 2;
  }
  #subnVxVy(x: number, y: number) {
    const value = this.data.registers[y] - this.data.registers[x];
    this.data.registers[x] = value;
    this.data.registers[0xf] = value < 0 ? 1 : 0;
    this.data.pc += 2;
  }
  #shiftRightVxVy(x: number, y: number) {
    const shiftOnIndex = this.data.shouldShiftOpcodeUseVY ? y : x;
    this.data.registers[0xf] = this.data.registers[shiftOnIndex] & 0x01;
    this.data.registers[x] = this.data.registers[shiftOnIndex] >> 1;
    this.data.pc += 2;
  }
  #shiftLeftVxVy(x: number, y: number) {
    const shiftOnIndex = this.data.shouldShiftOpcodeUseVY ? y : x;
    this.data.registers[0xf] = this.data.registers[shiftOnIndex] & 0x80;
    this.data.registers[x] = this.data.registers[shiftOnIndex] << 1;
    this.data.pc += 2;
  }
  #addIVx(x: number) {
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
  #drawVxVyN(x: number, y: number, n: number) {
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
