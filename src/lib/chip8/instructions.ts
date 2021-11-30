export const chip8InstructionsIDs = [
  /// Clear screen.
  "CLS",
  /// Return from a subroutine.
  "RET",
  /// 0x1NNN: Jump to location `NNN`.
  "JP_ADDR",
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
}

type ParameterByteConstant = BaseParameter<"ByteConstant"> & {
  byte: number;
}

type ParameterNibbleConstant = BaseParameter<"NibbleConstant"> & {
  nibble: number;
}

type ParameterRegister = BaseParameter<"Register"> & {
  /** From 0x0 to 0xF (nibble). */
  registerIndex: number;
}

type Chip8InstructionParameter<Type extends Chip8InstructionParameterType = Chip8InstructionParameterType> = {
  type: Type;
}

type Chip8InstructionsParametersTypesTable = {
  CLS: [];
  RET: [];
  JP_ADDR: [NNN: ParameterTypeAddress];
};

type Chip8MatchOpcodeOutputForInstructionID<ID extends Chip8InstructionID = Chip8InstructionID> = {
  parameters: Chip8InstructionsParametersTypesTable[ID];
} | false;

export interface Chip8Instruction<ID extends Chip8InstructionID = Chip8InstructionID> {
  id: ID,
  /**
   * Opcode matcher.
   *
   * Returns all of the instruction's parameters, if any.
   */
  matchOpcode: ({ n4, n3, n2, n1, opcode }: {
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
    if (n3) {
      output |= n3 << 8;
    }
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
    matchOpcode: ({ opcode }) => opcode === 0x00E0 ? {
      parameters: [],
    } : false,
  },
  RET: {
    id: "RET",
    matchOpcode: ({ opcode }) => opcode === 0x00EE ? {
      parameters: [],
    } : false,
  },
  JP_ADDR: {
    id: "JP_ADDR",
    matchOpcode: ({ n4, n3, n2, n1 }) => n4 === 0x1
      ? {
        parameters: [{
          type: "Address",
          address: wordFromNibbles([n1, n2, n3]),
        }],
      }
      : false
  },
};

export type Chip8DisassembledInstruction<ID extends Chip8InstructionID = Chip8InstructionID> =
  Omit<Chip8Instruction<ID>, "matchOpcode"> & {
    parameters: Chip8InstructionsParametersTypesTable[ID];
  };

/**
 * Try to disassemble an opcode word (2 bytes = 16 bits) into the internal
 * instruction representation.
 */
export const instructionFromOpcode = (opcode: number): Chip8DisassembledInstruction | null => {
  const [n4, n3, n2, n1] = [
    (opcode & 0xF000) >> 12,
    (opcode & 0x0F00) >> 8,
    (opcode & 0x00F0) >> 4,
    (opcode & 0x000F),
  ];
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
