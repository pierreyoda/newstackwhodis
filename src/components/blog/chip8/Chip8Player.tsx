import { FocusEvent, FunctionComponent, KeyboardEvent, useMemo } from "react";

import { isDefined } from "@/utils";
import { Chip8Keypad } from "./Chip8Keypad";
import { ColorRGB, useChip8VirtualMachine } from "./useChip8VirtualMachine";
import { chip8AzertyInputsMap, chip8QwertyInputsMap } from "@/content/chip8/input";

interface Chip8PlayerProps {
  /** ROM content to play. */
  rom: Uint8Array;
  /** Size (in pixels) of an individual virtual CHIP-8 pixel. */
  scale: number;
  /** Rendering color for OFF pixels. */
  offColor?: ColorRGB;
  /** Rendering color for ON pixels. */
  onColor?: ColorRGB;
  /** Keypad input mapping scheme. */
  inputScheme?: "QWERTY" | "AZERTY";
  /** Hide CHIP-8 virtual keypad? */
  disableKeypad?: boolean;
  /**
   * CPU speed factor (1 by default i.e. 240 instructions per second, 2 for double speed).
   * Delay and sound timers always run at 60Hz.
   */
  vmTickRateMsFactor?: number;
}

export const Chip8Player: FunctionComponent<Chip8PlayerProps> = ({
  rom,
  scale = 16,
  offColor,
  onColor,
  inputScheme = "QWERTY",
  disableKeypad = false,
  vmTickRateMsFactor = 1,
}) => {
  const { containerRef, pressKey, releaseKey, releaseAllKeys } = useChip8VirtualMachine({
    rom,
    scale,
    offColor,
    onColor,
    vmTickRateMsFactor,
  });
  const inputsMap = useMemo(
    () => (inputScheme === "QWERTY" ? chip8QwertyInputsMap : chip8AzertyInputsMap),
    [inputScheme],
  );

  // Only the focused player (click on it, or Tab to it) receives key events.
  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const keypadIndex = inputsMap[event.code];
    if (!isDefined(keypadIndex)) {
      return;
    }
    event.preventDefault();
    if (event.repeat) {
      return;
    }
    pressKey(keypadIndex);
  };
  const handleKeyUp = (event: KeyboardEvent<HTMLDivElement>) => {
    const keypadIndex = inputsMap[event.code];
    if (!isDefined(keypadIndex)) {
      return;
    }
    releaseKey(keypadIndex);
  };
  const handleBlur = (event: FocusEvent<HTMLDivElement>) => {
    // focus moving to a child (e.g. a virtual keypad button) keeps the player focused
    if (event.currentTarget.contains(event.relatedTarget)) {
      return;
    }
    // the matching keyup events will not reach us anymore: release everything
    releaseAllKeys();
  };

  return (
    <div
      className="flex flex-col md:flex-row"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onKeyUp={handleKeyUp}
      onBlur={handleBlur}
    >
      <div ref={containerRef} />
      {!disableKeypad && <Chip8Keypad onKeyPressed={pressKey} onKeyReleased={releaseKey} />}
    </div>
  );
};
