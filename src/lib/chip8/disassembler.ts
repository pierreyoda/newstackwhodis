import { Chip8Instruction, chip8InstructionSet } from "./instructions";

/**
 * Decodes a raw 2-bytes opcode into internal instruction representation.
 */
export const disassemble = (opcode: number): {
  instruction: Chip8Instruction;
} | null => {
  const instruction = Object.values(chip8InstructionSet).find(({
    opcode: instructionOpcode,
    mask: instructionMask,
  }) => (opcode & instructionMask) === instructionOpcode);
  if (!instruction) {
    return null;
  }
};
