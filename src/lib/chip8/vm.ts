import { instructionFromOpcode } from "./instructions";

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
  /** The program counter (8 bits) is the memory address of the current instruction. */
  pc: number,
  /** Sound timer (8 bits). */
  ST: number;
  /** Delay timer (8 bits). */
  DT: number;
}

export class Chip8VirtualMachine {
  data: Chip8VirtualMachineData;

  constructor() {
    this.reset();
  }

  reset() {
    this.data = initChip8VirtualMachineData();
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
}

export const initChip8VirtualMachineData = (): Chip8VirtualMachineData => ({
  memory: new Uint8Array(4096),
  registers: new Uint8Array(16),
  stack: new Uint16Array(16),
  sp: -1,
  pc: 0x200,
  ST: 0,
  DT: 0,
});
