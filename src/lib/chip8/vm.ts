import { Chip8DisassembledInstruction, instructionFromOpcode } from "./instructions";

const DISPLAY_WIDTH = 64;
const DISPLAY_HEIGHT = 32;

export interface Chip8VirtualMachineData {
  /** 4KB of RAM (4096 bytes), from 0x000 to 0xFFF. */
  memory: Uint8Array,
  /** 16 8-bit registers (V0 to VF, VF being a flag register). */
  registers: Uint8Array,
  /** Subroutines address stack (16 16-bit values). */
  stack: Uint16Array,
  /** The stack pointer (8 bits) points to the top level of the stack. */
  sp: number,
  /** Index register nibble (4 bits). */
  i: number;
  /** The program counter (8 bits) is the memory address of the current instruction. */
  pc: number,
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
}

export class Chip8VirtualMachine {
  data: Chip8VirtualMachineData = initChip8VirtualMachineData();

  reset() {
    this.data = initChip8VirtualMachineData();
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
    } else if (decodedInstruction.id === "ADD_I_VX") {
      const { parameters } = decodedInstruction as Chip8DisassembledInstruction<"ADD_I_VX">;
      this.#addIVx(parameters[0].registerIndex);
    }
  }

  #clearScreen() {
    // TODO: this.context.display.clear();
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

  #loadVxNN(x: number, nn: number) {
    this.data.registers[x] = nn;
    this.data.pc += 2;
  }
  #loadVxVy(x: number, y: number) {
    this.data.registers[x] = this.data.registers[y];
    this.data.pc += 2;
  }
  #loadIAddress(nnn: number) {
    this.data.i = nnn;
    this.data.pc += 2;
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
    this.data.registers[0xF] = value > 0xFF ? 1 : 0;
    this.data.pc += 2;
  }
  #subVxVy(x: number, y: number) {
    const value = this.data.registers[x] - this.data.registers[y];
    this.data.registers[x] = value;
    this.data.registers[0xF] = value < 0 ? 1 : 0;
    this.data.pc += 2;
  }
  #subnVxVy(x: number, y: number) {
    const value = this.data.registers[y] - this.data.registers[x];
    this.data.registers[x] = value;
    this.data.registers[0xF] = value < 0 ? 1 : 0;
    this.data.pc += 2;
  }
  #shiftRightVxVy(x: number, y: number) {
    const shiftOnIndex = this.data.shouldShiftOpcodeUseVY ? y : x;
    this.data.registers[0xF] = this.data.registers[shiftOnIndex] & 0x01;
    this.data.registers[x] = this.data.registers[shiftOnIndex] >> 1;
    this.data.pc += 2;
  }
  #shiftLeftVxVy(x: number, y: number) {
    const shiftOnIndex = this.data.shouldShiftOpcodeUseVY ? y : x;
    this.data.registers[0xF] = this.data.registers[shiftOnIndex] & 0x80;
    this.data.registers[x] = this.data.registers[shiftOnIndex] << 1;
    this.data.pc += 2;
  }
  #addIVx(x: number) {
    this.data.i += this.data.registers[x];
    this.data.pc += 2;
  }
}

export const initChip8VirtualMachineData = (): Chip8VirtualMachineData => ({
  memory: new Uint8Array(4096),
  registers: new Uint8Array(16),
  stack: new Uint16Array(16),
  sp: 0,
  i: 0,
  pc: 0x200,
  ST: 0,
  DT: 0,
  shouldShiftOpcodeUseVY: false,
});
