import { FunctionComponent } from "react";

interface Chip8KeyProps {
  label: string;
  onPressed: () => void;
}

export const Chip8Key: FunctionComponent<Chip8KeyProps> = ({ label, onPressed }) => (
  <button className="bg-space h-8 w-8 rounded-sm" onClick={onPressed}>
    {label}
  </button>
);
