export const chip8InstructionsIDs = [
  /// Clear screen.
  "CLS",
  /// Return from a subroutine.
  "RET",
  /// 0x1NNN: Jump to address `NNN`.
  "JP_ADDR",
  /// 0x2NNN: Calls subroutine at address `NNN`.
  "CALL_ADDR",
  /// 0x3XNN: Skip the next instruction if VX equals `NN`.
  "SE_VX_NN",
  /// 0x4XNN: Skip the next instruction if VX does not equal `NN`.
  "SNE_VX_NN",
  /// 0x5XY0: Skip the next instruction if VX equals VY.
  "SE_VX_VY",
  /// 0x6XNN: Set VX to `NN`.
  "LD_VX_NN",
  /// 0x7XNN: Add `NN` to VX (without changing the carry flag).
  "ADD_VX_NN",
  /// 0x8XY0: Set VX to VY.
  "LD_VX_VY",
  /// 0x8XY1: Set VX to `VX OR VY`.
  "OR_VX_VY",
  /// 0x8XY2: Set VX to `VX AND VY`.
  "AND_VX_VY",
  /// 0x8XY3: Set VX to `VX XOR VY`.
  "XOR_VX_VY",
  /// 0x8XY4: Add VY to VX. VF is set to 1 when there's a carry, and to 0 when there is not.
  "ADD_VX_VY",
  /// 0x8XY5: VY is subtracted from VX. VF is set to 0 when there's a borrow, and 1 when there is not.
  "SUB_VX_VY",
  /// 0x8XY6: Stores the least significant bit of VX in VF and then shifts VX to the right by 1.
  "SHR_VX_VY",
  /// 0x8XY7: Sets VX to VY minus VX. VF is set to 0 when there's a borrow, and 1 when there is not.
  "SUBN_VX_VY",
  /// 0x8XYE: Stores the most significant bit of VX in VF and then shifts VX to the left by 1.
  "SHL_VX_VY",
  /// 0x9XY0: Skip the next instruction if VX does not equal VY.
  "SNE_VX_VY",
  /// 0xANNN: Set I to `NNN`.
  "LD_I_ADDR",
  /// 0xBNNN: Jump to the address `NNN + V0`.
  "JP_ADDR_V0",
  /// 0xCXNN: Set VX to the result of an AND operation on a random number (from 0 to 255) and `NN`.
  "RND_VX_NN",
  /// 0xDXYN: Draw a sprite at coordinate (VX, VY) that has a width of 8 pixels and a height of N pixels.
  "DRW_VX_VY_N",
  /// 0xEX9E: Skip the next instruction if the key stored in VX is pressed.
  "SKP_VX",
  /// 0xEXA1: Skip the next instruction if the key stored in VX is not pressed.
  "SKNP_VX",
  /// 0xFX07: Set VX to the value of the delay timer.
  "LD_VX_DT",
  /// 0xFX0A: A key press is awaited, and then stored in VX (blocking operation).
  "LD_VX_KEY",
  /// 0xFX15: Set the delay timer to VX.
  "LD_DT_VX",
  /// 0xFX18: Set the sound timer to VX.
  "LD_ST_VX",
  /// 0xFX1E: Add VX to I (without changing the carry flag).
  "ADD_I_VX",
  /// 0xFX29: Set I to the location of the sprite for the character in VX.
  "LD_I_FONT_VX",
  /// 0xFX33: Store the Binary-Coded Decimal representation of VX, with the most significant of three digits at the address in I, the middle digit at I plus 1, and the least significant digit at I plus 2.
  "LD_MEM_I_BCD_VX",
  /// 0xFX55: Store from V0 to VX (included) in memory, starting at address I.
  "LD_MEM_I_REGS",
  /// 0xFX65: Fill V0 to VX (included) with values from memory, starting at address I.
  "LD_REGS_MEM_I",
] as const;
export type Chip8InstructionID = typeof chip8InstructionsIDs[number];

export const chip8InstructionParameterTypes = [
  /// Address (NNN).
  "Address",
  /// Byte constant (NN).
  "ByteConstant",
  /// Nibble (half-byte = 4 bits) constant (N).
  "NibbleConstant",
  /// 4-bit register identifier (V0 to VF).
  "Register",
] as const;
export type Chip8InstructionParameterType = typeof chip8InstructionParameterTypes[number];

type BaseParameter<Type extends Chip8InstructionParameterType = Chip8InstructionParameterType> = {
  type: Type;
};

type ParameterTypeAddress = BaseParameter<"Address"> & {
  address: number;
};

type ParameterByteConstant = BaseParameter<"ByteConstant"> & {
  byte: number;
};

type ParameterNibbleConstant = BaseParameter<"NibbleConstant"> & {
  nibble: number;
};

type ParameterRegister = BaseParameter<"Register"> & {
  /** From 0x0 to 0xF (nibble). */
  registerIndex: number;
};

type Chip8InstructionsParametersTypesTable = {
  CLS: [];
  RET: [];
  JP_ADDR: [NNN: ParameterTypeAddress];
  CALL_ADDR: [NNN: ParameterTypeAddress];
  SE_VX_NN: [X: ParameterRegister, NN: ParameterByteConstant];
  SNE_VX_NN: [X: ParameterRegister, NN: ParameterByteConstant];
  SE_VX_VY: [X: ParameterRegister, Y: ParameterRegister];
  LD_VX_NN: [X: ParameterRegister, NN: ParameterByteConstant];
  ADD_VX_NN: [X: ParameterRegister, NN: ParameterByteConstant];
  LD_VX_VY: [X: ParameterRegister, Y: ParameterRegister];
  OR_VX_VY: [X: ParameterRegister, Y: ParameterRegister];
  AND_VX_VY: [X: ParameterRegister, Y: ParameterRegister];
  XOR_VX_VY: [X: ParameterRegister, Y: ParameterRegister];
  ADD_VX_VY: [X: ParameterRegister, Y: ParameterRegister];
  SUB_VX_VY: [X: ParameterRegister, Y: ParameterRegister];
  SHR_VX_VY: [X: ParameterRegister, Y: ParameterRegister];
  SUBN_VX_VY: [X: ParameterRegister, Y: ParameterRegister];
  SHL_VX_VY: [X: ParameterRegister, Y: ParameterRegister];
  SNE_VX_VY: [X: ParameterRegister, Y: ParameterRegister];
  LD_I_ADDR: [NNN: ParameterTypeAddress];
  JP_ADDR_V0: [NNN: ParameterTypeAddress];
  RND_VX_NN: [X: ParameterRegister, NN: ParameterByteConstant];
  DRW_VX_VY_N: [X: ParameterRegister, Y: ParameterRegister, N: ParameterNibbleConstant];
  SKP_VX: [X: ParameterRegister];
  SKNP_VX: [X: ParameterRegister];
  LD_VX_DT: [X: ParameterRegister];
  LD_VX_KEY: [X: ParameterRegister];
  LD_DT_VX: [X: ParameterRegister];
  LD_ST_VX: [X: ParameterRegister];
  ADD_I_VX: [X: ParameterRegister];
  LD_I_FONT_VX: [X: ParameterRegister];
  LD_MEM_I_BCD_VX: [X: ParameterRegister];
  LD_MEM_I_REGS: [X: ParameterRegister];
  LD_REGS_MEM_I: [X: ParameterRegister];
};

type Chip8MatchOpcodeOutputForInstructionID<ID extends Chip8InstructionID = Chip8InstructionID> =
  | {
      parameters: Chip8InstructionsParametersTypesTable[ID];
    }
  | false;

export interface Chip8Instruction<ID extends Chip8InstructionID = Chip8InstructionID> {
  id: ID;
  /**
   * Opcode matcher.
   *
   * Returns all of the instruction's parameters, if any.
   */
  matchOpcode: ({
    n4,
    n3,
    n2,
    n1,
    opcode,
  }: {
    n1: number;
    n2: number;
    n3: number;
    n4: number;
    opcode: number;
  }) => Chip8MatchOpcodeOutputForInstructionID<ID>;
}

const wordFromNibbles = ([n1, n2, n3]: [n1: number, n2?: number, n3?: number]): number => {
  let output = n1;
  if (n2) {
    output |= n2 << 4;
  }
  if (n3) {
    output |= n3 << 8;
  }
  return output;
};

/**
 * @see https://www.wikiwand.com/en/CHIP-8#/Opcode_table
 * @see http://devernay.free.fr/hacks/chip8/C8TECH10.HTM#3.1
 */
export const chip8InstructionSet: Record<Chip8InstructionID, Chip8Instruction> = {
  CLS: {
    id: "CLS",
    matchOpcode: ({ opcode }) =>
      opcode === 0x00e0
        ? {
            parameters: [],
          }
        : false,
  },
  RET: {
    id: "RET",
    matchOpcode: ({ opcode }) =>
      opcode === 0x00ee
        ? {
            parameters: [],
          }
        : false,
  },
  JP_ADDR: {
    id: "JP_ADDR",
    matchOpcode: ({ n4, n3, n2, n1 }) =>
      n4 === 0x1
        ? {
            parameters: [
              {
                type: "Address",
                address: wordFromNibbles([n1, n2, n3]),
              },
            ],
          }
        : false,
  },
  CALL_ADDR: {
    id: "CALL_ADDR",
    matchOpcode: ({ n4, n3, n2, n1 }) =>
      n4 === 0x2
        ? {
            parameters: [
              {
                type: "Address",
                address: wordFromNibbles([n1, n2, n3]),
              },
            ],
          }
        : false,
  },
  SE_VX_NN: {
    id: "SE_VX_NN",
    matchOpcode: ({ n4, n3, n2, n1 }) =>
      n4 === 0x3
        ? {
            parameters: [
              {
                type: "Register",
                registerIndex: n3,
              },
              {
                type: "ByteConstant",
                byte: wordFromNibbles([n1, n2]),
              },
            ],
          }
        : false,
  },
  SNE_VX_NN: {
    id: "SE_VX_NN",
    matchOpcode: ({ n4, n3, n2, n1 }) =>
      n4 === 0x4
        ? {
            parameters: [
              {
                type: "Register",
                registerIndex: n3,
              },
              {
                type: "ByteConstant",
                byte: wordFromNibbles([n1, n2]),
              },
            ],
          }
        : false,
  },
  SE_VX_VY: {
    id: "SE_VX_VY",
    matchOpcode: ({ n4, n3, n2, n1 }) =>
      n4 === 0x5 && n1 === 0x0
        ? {
            parameters: [
              {
                type: "Register",
                registerIndex: n3,
              },
              {
                type: "Register",
                registerIndex: n2,
              },
            ],
          }
        : false,
  },
  LD_VX_NN: {
    id: "LD_VX_NN",
    matchOpcode: ({ n4, n3, n2, n1 }) =>
      n4 === 0x6
        ? {
            parameters: [
              {
                type: "Register",
                registerIndex: n3,
              },
              {
                type: "ByteConstant",
                byte: wordFromNibbles([n1, n2]),
              },
            ],
          }
        : false,
  },
  ADD_VX_NN: {
    id: "ADD_VX_NN",
    matchOpcode: ({ n4, n3, n2, n1 }) =>
      n4 === 0x7
        ? {
            parameters: [
              {
                type: "Register",
                registerIndex: n3,
              },
              {
                type: "ByteConstant",
                byte: wordFromNibbles([n1, n2]),
              },
            ],
          }
        : false,
  },
  LD_VX_VY: {
    id: "LD_VX_VY",
    matchOpcode: ({ n4, n3, n2, n1 }) =>
      n4 === 0x8 && n1 === 0x0
        ? {
            parameters: [
              {
                type: "Register",
                registerIndex: n3,
              },
              {
                type: "Register",
                registerIndex: n2,
              },
            ],
          }
        : false,
  },
  OR_VX_VY: {
    id: "OR_VX_VY",
    matchOpcode: ({ n4, n3, n2, n1 }) =>
      n4 === 0x8 && n1 === 0x1
        ? {
            parameters: [
              {
                type: "Register",
                registerIndex: n3,
              },
              {
                type: "Register",
                registerIndex: n2,
              },
            ],
          }
        : false,
  },
  AND_VX_VY: {
    id: "AND_VX_VY",
    matchOpcode: ({ n4, n3, n2, n1 }) =>
      n4 === 0x8 && n1 === 0x2
        ? {
            parameters: [
              {
                type: "Register",
                registerIndex: n3,
              },
              {
                type: "Register",
                registerIndex: n2,
              },
            ],
          }
        : false,
  },
  XOR_VX_VY: {
    id: "XOR_VX_VY",
    matchOpcode: ({ n4, n3, n2, n1 }) =>
      n4 === 0x8 && n1 === 0x3
        ? {
            parameters: [
              {
                type: "Register",
                registerIndex: n3,
              },
              {
                type: "Register",
                registerIndex: n2,
              },
            ],
          }
        : false,
  },
  ADD_VX_VY: {
    id: "ADD_VX_VY",
    matchOpcode: ({ n4, n3, n2, n1 }) =>
      n4 === 0x8 && n1 === 0x4
        ? {
            parameters: [
              {
                type: "Register",
                registerIndex: n3,
              },
              {
                type: "Register",
                registerIndex: n2,
              },
            ],
          }
        : false,
  },
  SUB_VX_VY: {
    id: "SUB_VX_VY",
    matchOpcode: ({ n4, n3, n2, n1 }) =>
      n4 === 0x8 && n1 === 0x5
        ? {
            parameters: [
              {
                type: "Register",
                registerIndex: n3,
              },
              {
                type: "Register",
                registerIndex: n2,
              },
            ],
          }
        : false,
  },
  SHR_VX_VY: {
    id: "SHR_VX_VY",
    matchOpcode: ({ n4, n3, n2, n1 }) =>
      n4 === 0x8 && n1 === 0x6
        ? {
            parameters: [
              {
                type: "Register",
                registerIndex: n3,
              },
              {
                type: "Register",
                registerIndex: n2,
              },
            ],
          }
        : false,
  },
  SUBN_VX_VY: {
    id: "SUBN_VX_VY",
    matchOpcode: ({ n4, n3, n2, n1 }) =>
      n4 === 0x8 && n1 === 0x7
        ? {
            parameters: [
              {
                type: "Register",
                registerIndex: n3,
              },
              {
                type: "Register",
                registerIndex: n2,
              },
            ],
          }
        : false,
  },
  SHL_VX_VY: {
    id: "SHL_VX_VY",
    matchOpcode: ({ n4, n3, n2, n1 }) =>
      n4 === 0x8 && n1 === 0xe
        ? {
            parameters: [
              {
                type: "Register",
                registerIndex: n3,
              },
              {
                type: "Register",
                registerIndex: n2,
              },
            ],
          }
        : false,
  },
  SNE_VX_VY: {
    id: "SNE_VX_VY",
    matchOpcode: ({ n4, n3, n2, n1 }) =>
      n4 === 0x9 && n1 === 0x0
        ? {
            parameters: [
              {
                type: "Register",
                registerIndex: n3,
              },
              {
                type: "Register",
                registerIndex: n2,
              },
            ],
          }
        : false,
  },
  LD_I_ADDR: {
    id: "LD_I_ADDR",
    matchOpcode: ({ n4, n3, n2, n1 }) =>
      n4 === 0xa
        ? {
            parameters: [
              {
                type: "Address",
                address: wordFromNibbles([n1, n2, n3]),
              },
            ],
          }
        : false,
  },
  JP_ADDR_V0: {
    id: "JP_ADDR_V0",
    matchOpcode: ({ n4, n3, n2, n1 }) =>
      n4 === 0xb
        ? {
            parameters: [
              {
                type: "Address",
                address: wordFromNibbles([n1, n2, n3]),
              },
            ],
          }
        : false,
  },
  RND_VX_NN: {
    id: "RND_VX_NN",
    matchOpcode: ({ n4, n3, n2, n1 }) =>
      n4 === 0xc
        ? {
            parameters: [
              {
                type: "Register",
                registerIndex: n3,
              },
              {
                type: "ByteConstant",
                byte: wordFromNibbles([n1, n2]),
              },
            ],
          }
        : false,
  },
  DRW_VX_VY_N: {
    id: "DRW_VX_VY_N",
    matchOpcode: ({ n4, n3, n2, n1 }) =>
      n4 === 0xd
        ? {
            parameters: [
              {
                type: "Register",
                registerIndex: n3,
              },
              {
                type: "Register",
                registerIndex: n2,
              },
              {
                type: "NibbleConstant",
                nibble: n1,
              },
            ],
          }
        : false,
  },
  SKP_VX: {
    id: "SKP_VX",
    matchOpcode: ({ n4, n3, n2, n1 }) =>
      n4 === 0xe && n2 === 0x9 && n1 === 0xe
        ? {
            parameters: [
              {
                type: "Register",
                registerIndex: n3,
              },
            ],
          }
        : false,
  },
  SKNP_VX: {
    id: "SKNP_VX",
    matchOpcode: ({ n4, n3, n2, n1 }) =>
      n4 === 0xe && n2 === 0xa && n1 === 0x1
        ? {
            parameters: [
              {
                type: "Register",
                registerIndex: n3,
              },
            ],
          }
        : false,
  },
  LD_VX_DT: {
    id: "LD_VX_DT",
    matchOpcode: ({ n4, n3, n2, n1 }) =>
      n4 === 0xf && n2 === 0x0 && n1 === 0x7
        ? {
            parameters: [
              {
                type: "Register",
                registerIndex: n3,
              },
            ],
          }
        : false,
  },
  LD_VX_KEY: {
    id: "LD_VX_KEY",
    matchOpcode: ({ n4, n3, n2, n1 }) =>
      n4 === 0xf && n2 === 0x0 && n1 === 0xa
        ? {
            parameters: [
              {
                type: "Register",
                registerIndex: n3,
              },
            ],
          }
        : false,
  },
  LD_DT_VX: {
    id: "LD_DT_VX",
    matchOpcode: ({ n4, n3, n2, n1 }) =>
      n4 === 0xf && n2 === 0x1 && n1 === 0x5
        ? {
            parameters: [
              {
                type: "Register",
                registerIndex: n3,
              },
            ],
          }
        : false,
  },
  LD_ST_VX: {
    id: "LD_ST_VX",
    matchOpcode: ({ n4, n3, n2, n1 }) =>
      n4 === 0xf && n2 === 0x1 && n1 === 0x8
        ? {
            parameters: [
              {
                type: "Register",
                registerIndex: n3,
              },
            ],
          }
        : false,
  },
  ADD_I_VX: {
    id: "ADD_I_VX",
    matchOpcode: ({ n4, n3, n2, n1 }) =>
      n4 === 0xf && n2 === 0x1 && n1 === 0xe
        ? {
            parameters: [
              {
                type: "Register",
                registerIndex: n3,
              },
            ],
          }
        : false,
  },
  LD_I_FONT_VX: {
    id: "LD_I_FONT_VX",
    matchOpcode: ({ n4, n3, n2, n1 }) =>
      n4 === 0xf && n2 === 0x2 && n1 === 0x9
        ? {
            parameters: [
              {
                type: "Register",
                registerIndex: n3,
              },
            ],
          }
        : false,
  },
  LD_MEM_I_BCD_VX: {
    id: "LD_MEM_I_BCD_VX",
    matchOpcode: ({ n4, n3, n2, n1 }) =>
      n4 === 0xf && n2 === 0x3 && n1 === 0x3
        ? {
            parameters: [
              {
                type: "Register",
                registerIndex: n3,
              },
            ],
          }
        : false,
  },
  LD_MEM_I_REGS: {
    id: "LD_MEM_I_REGS",
    matchOpcode: ({ n4, n3, n2, n1 }) =>
      n4 === 0xf && n2 === 0x5 && n1 === 0x5
        ? {
            parameters: [
              {
                type: "Register",
                registerIndex: n3,
              },
            ],
          }
        : false,
  },
  LD_REGS_MEM_I: {
    id: "LD_REGS_MEM_I",
    matchOpcode: ({ n4, n3, n2, n1 }) =>
      n4 === 0xf && n2 === 0x6 && n1 === 0x5
        ? {
            parameters: [
              {
                type: "Register",
                registerIndex: n3,
              },
            ],
          }
        : false,
  },
};

export type Chip8DisassembledInstruction<ID extends Chip8InstructionID> = Omit<Chip8Instruction<ID>, "matchOpcode"> & {
  parameters: Chip8InstructionsParametersTypesTable[ID];
};

/**
 * Try to disassemble an opcode word (2 bytes = 16 bits) into the internal
 * instruction representation.
 */
export const instructionFromOpcode = (opcode: number): Chip8DisassembledInstruction<Chip8InstructionID> | null => {
  const [n4, n3, n2, n1] = [(opcode & 0xf000) >> 12, (opcode & 0x0f00) >> 8, (opcode & 0x00f0) >> 4, opcode & 0x000f];
  for (const { matchOpcode, ...instruction } of Object.values(chip8InstructionSet)) {
    const matchOutput = matchOpcode({ n4, n3, n2, n1, opcode });
    if (matchOutput) {
      return {
        ...instruction,
        ...matchOutput,
      };
    }
  }
  return null;
};
