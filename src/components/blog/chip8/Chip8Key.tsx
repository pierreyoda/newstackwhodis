import { FunctionComponent } from "react";

interface Chip8KeyProps {
  label: string;
  onPressed: () => void;
}

export const Chip8Key: FunctionComponent<Chip8KeyProps> = ({ label, onPressed }) => (
  <button className="w-8 h-8 rounded bg-space" onClick={onPressed}>
    {label}
  </button>
);
