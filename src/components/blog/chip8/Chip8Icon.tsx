import { FunctionComponent, ReactNode } from "react";

export type Chip8IconName = "rotate" | "up" | "down" | "left" | "right" | "chevron" | "play";

const iconPaths: Record<Chip8IconName, ReactNode> = {
  rotate: (
    <>
      <path d="M20 12a8 8 0 1 1-2.34-5.662" />
      <path d="M20 4v5h-5" />
    </>
  ),
  up: (
    <>
      <path d="M12 19V5" />
      <path d="M6 11l6-6 6 6" />
    </>
  ),
  down: (
    <>
      <path d="M12 5v14" />
      <path d="M6 13l6 6 6-6" />
    </>
  ),
  left: (
    <>
      <path d="M19 12H5" />
      <path d="M11 18l-6-6 6-6" />
    </>
  ),
  right: (
    <>
      <path d="M5 12h14" />
      <path d="M13 6l6 6-6 6" />
    </>
  ),
  chevron: <path d="M9 6l6 6-6 6" />,
  play: (
    <path
      fill="currentColor"
      stroke="none"
      d="M8 5.5v13a1 1 0 0 0 1.5.86l10.5-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5z"
    />
  ),
};

interface Chip8IconProps {
  name: Chip8IconName;
  className?: string;
}

/** Decorative stroke icon, drawn in the current text color. */
export const Chip8Icon: FunctionComponent<Chip8IconProps> = ({ name, className }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2.6}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    className={className}
  >
    {iconPaths[name]}
  </svg>
);
