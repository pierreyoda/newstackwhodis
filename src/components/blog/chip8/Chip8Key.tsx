import { CSSProperties, FunctionComponent, PointerEvent, ReactNode } from "react";
import clsx from "clsx";

interface Chip8KeyProps {
  onPressed: () => void;
  onReleased: () => void;
  className?: string;
  style?: CSSProperties;
  "aria-label"?: string;
  children: ReactNode;
}

/**
 * A virtual keypad key, held down for as long as the pointer (mouse, finger, pen) presses it.
 *
 * Pointer events (rather than `click`) are needed since ROMs check whether a key is currently held.
 */
export const Chip8Key: FunctionComponent<Chip8KeyProps> = ({
  onPressed,
  onReleased,
  className,
  style,
  "aria-label": ariaLabel,
  children,
}) => {
  const handlePointerDown = (event: PointerEvent<HTMLButtonElement>) => {
    // primary button / touch contact / pen contact only
    if (event.button !== 0) {
      return;
    }
    onPressed();
  };

  return (
    <button
      type="button"
      aria-label={ariaLabel}
      className={clsx("touch-none select-none", className)}
      style={style}
      onPointerDown={handlePointerDown}
      onPointerUp={onReleased}
      onPointerLeave={onReleased}
      onPointerCancel={onReleased}
      onContextMenu={event => event.preventDefault()}
    >
      {children}
    </button>
  );
};
