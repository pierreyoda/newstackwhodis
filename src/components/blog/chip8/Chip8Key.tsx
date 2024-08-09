import { FunctionComponent } from "react";

interface Chip8KeyProps {
  label: string;
  onPressed: () => void;
}

export const Chip8Key: FunctionComponent<Chip8KeyProps> = ({ label, onPressed }) => (
  <button className="h-8 w-8 rounded bg-space" onClick={onPressed}>
    {label}
  </button>
);
