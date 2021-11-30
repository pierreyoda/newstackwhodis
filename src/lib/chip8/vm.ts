/* eslint-disable @typescript-eslint/no-non-null-assertion */
// TODO: find a way to avoid non-null assertion checks (`!`) in the instruction dispatcher

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
    switch (decodedInstruction.id) {
      case "CLS": this.#clearScreen(); break;
      case "RET": this.#return(); break;
      case "JP_ADDR": this.#jumpAddress(decodedInstruction.parameters[0]!.address); break;
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
  i: 0,
  pc: 0x200,
  ST: 0,
  DT: 0,
  shouldShiftOpcodeUseVY: false,
});
