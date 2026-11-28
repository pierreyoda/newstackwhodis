import { FunctionComponent, ReactNode } from "react";

export type IconName = "arrow-up-right" | "star" | "fork";

const iconPaths: Record<IconName, ReactNode> = {
  "arrow-up-right": (
    <>
      <path d="M7 17 17 7" />
      <path d="M8 7h9v9" />
    </>
  ),
  star: (
    <path
      fill="currentColor"
      strokeWidth={1.5}
      d="M12 3 14.35 9.36 21.13 9.63 15.8 13.84 17.64 20.37 12 16.6 6.36 20.37 8.2 13.84 2.87 9.63 9.65 9.36Z"
    />
  ),
  fork: (
    <>
      <circle cx="6" cy="5" r="2.2" />
      <circle cx="18" cy="5" r="2.2" />
      <circle cx="12" cy="19" r="2.2" />
      <path d="M6 7.2V9a3 3 0 0 0 3 3h6a3 3 0 0 0 3-3V7.2" />
      <path d="M12 12v4.8" />
    </>
  ),
};

interface IconProps {
  name: IconName;
  className?: string;
}

/** Decorative stroke icon, drawn in the current text color. */
export const Icon: FunctionComponent<IconProps> = ({ name, className }) => (
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
