import { FunctionComponent } from "react";

import { Chip8Key } from "./Chip8Key";
import { Chip8KeypadIndex, chip8KeypadIndices } from "@/content/chip8/input";

const labelsPerKey: Record<Chip8KeypadIndex, string> = {
  0x0: "1",
  0x1: "2",
  0x2: "3",
  0x3: "4",
  0x4: "Q",
  0x5: "W",
  0x6: "E",
  0x7: "R",
  0x8: "A",
  0x9: "S",
  0xa: "D",
  0xb: "F",
  0xc: "Z",
  0xd: "X",
  0xe: "C",
  0xf: "V",
};

interface Chip8KeypadProps {
  onKeyPressed: (key: Chip8KeypadIndex) => void;
}

export const Chip8Keypad: FunctionComponent<Chip8KeypadProps> = ({ onKeyPressed }) => (
  <div className="grid grid-cols-4 grid-rows-4 gap-x-12 gap-y-4 md:gap-y-2">
    {chip8KeypadIndices.map(keypadIndex => (
      <Chip8Key key={keypadIndex} label={labelsPerKey[keypadIndex]} onPressed={() => onKeyPressed(keypadIndex)} />
    ))}
  </div>
);
