import { FocusEvent, FunctionComponent, KeyboardEvent, ReactNode, useRef, useState } from "react";
import clsx from "clsx";

import { isDefined } from "@/utils";
import { TETRIS_ROM } from "@/content/chip8/article";
import { Chip8Icon, Chip8IconName } from "./Chip8Icon";
import { Chip8KeypadIndex, chip8QwertyInputsMap } from "@/content/chip8/input";
import { Chip8Key } from "./Chip8Key";
import { Chip8Keypad } from "./Chip8Keypad";
import { useChip8VirtualMachine } from "./useChip8VirtualMachine";

type ArrowKeyCode = "ArrowUp" | "ArrowLeft" | "ArrowRight" | "ArrowDown";

interface TetrisControl {
  /** Short label, on the on-screen button. */
  label: string;
  /** Longer label, in the keyboard legend. */
  description: string;
  icon: Chip8IconName;
  /** CHIP-8 key polled by the ROM for this action. */
  keypadIndex: Chip8KeypadIndex;
  /** Supplementary keyboard input, on top of the CHIP-8 keypad mapping. */
  arrowKeyCode: ArrowKeyCode;
  /** Cell in the on-screen 3x2 controls grid. */
  gridColumn: number;
  gridRow: number;
}

/** The Tetris ROM polls CHIP-8 keys 4 to 7 in its main loop (EXA1 / EX9E opcodes at 0x23C-0x248). */
const TETRIS_CONTROLS: readonly TetrisControl[] = [
  {
    label: "Rotate",
    description: "Rotate",
    icon: "rotate",
    keypadIndex: 0x4,
    arrowKeyCode: "ArrowUp",
    gridColumn: 2,
    gridRow: 1,
  },
  {
    label: "Left",
    description: "Move left",
    icon: "left",
    keypadIndex: 0x5,
    arrowKeyCode: "ArrowLeft",
    gridColumn: 1,
    gridRow: 2,
  },
  {
    label: "Right",
    description: "Move right",
    icon: "right",
    keypadIndex: 0x6,
    arrowKeyCode: "ArrowRight",
    gridColumn: 3,
    gridRow: 2,
  },
  {
    label: "Drop",
    description: "Drop faster",
    icon: "down",
    keypadIndex: 0x7,
    arrowKeyCode: "ArrowDown",
    gridColumn: 2,
    gridRow: 2,
  },
];

const arrowKeyIcons: Record<ArrowKeyCode, { icon: Chip8IconName; label: string }> = {
  ArrowUp: { icon: "up", label: "Up arrow" },
  ArrowLeft: { icon: "left", label: "Left arrow" },
  ArrowRight: { icon: "right", label: "Right arrow" },
  ArrowDown: { icon: "down", label: "Down arrow" },
};

const inputsMap: Record<string, Chip8KeypadIndex> = {
  ...chip8QwertyInputsMap,
  ...Object.fromEntries(TETRIS_CONTROLS.map(({ arrowKeyCode, keypadIndex }) => [arrowKeyCode, keypadIndex])),
};

/** Keyboard key (as printed on a QWERTY keyboard) mapped to a CHIP-8 key, e.g. "Q". */
const getKeyboardLabel = (keypadIndex: Chip8KeypadIndex) =>
  Object.entries(chip8QwertyInputsMap)
    .find(([, index]) => index === keypadIndex)?.[0]
    .replace(/^(Key|Digit)/, "") ?? "";

const KeyboardKey: FunctionComponent<{ label?: string; children: ReactNode }> = ({ label, children }) => (
  <kbd
    aria-label={label}
    className="border-gray bg-black-darker inline-flex h-7 min-w-7 items-center justify-center rounded-[5px] border border-b-[3px] px-1 font-mono text-[13px] font-semibold text-white"
  >
    {children}
  </kbd>
);

/** Arrow key, then the CHIP-8 keypad key, for a Tetris action. */
const ControlKeys: FunctionComponent<{ control: TetrisControl }> = ({ control }) => {
  const arrowKey = arrowKeyIcons[control.arrowKeyCode];
  return (
    <>
      <KeyboardKey label={arrowKey.label}>
        <Chip8Icon name={arrowKey.icon} className="h-3.5 w-3.5" />
      </KeyboardKey>
      <span className="text-gray-lighter text-xs">or</span>
      <KeyboardKey>{getKeyboardLabel(control.keypadIndex)}</KeyboardKey>
    </>
  );
};

interface Chip8TetrisPlayerProps {
  /** Size (in pixels) of an individual virtual CHIP-8 pixel. */
  scale?: number;
  /**
   * CPU speed factor (1 i.e. 240 instructions per second).
   * NB: the tap-to-step input timing was tuned with a factor of 10.
   */
  vmTickRateMsFactor?: number;
}

/**
 * Plays the CHIP-8 Tetris ROM, with game controls (on-screen and keyboard, arrow keys included).
 *
 * The game only runs while the player has the focus: a click on the screen starts it,
 * and clicking anywhere else pauses it.
 */
export const Chip8TetrisPlayer: FunctionComponent<Chip8TetrisPlayerProps> = ({
  scale = 10,
  vmTickRateMsFactor = 10,
}) => {
  const playerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isKeypadShown, setIsKeypadShown] = useState(false);
  const [pressedKeys, setPressedKeys] = useState<ReadonlySet<Chip8KeypadIndex>>(() => new Set());
  const { containerRef, pressKey, releaseKey, releaseAllKeys, resetVm } = useChip8VirtualMachine({
    rom: TETRIS_ROM,
    scale,
    vmTickRateMsFactor,
    isPaused: !isPlaying,
    tapToStep: true,
  });

  const press = (keypadIndex: Chip8KeypadIndex) => {
    pressKey(keypadIndex);
    setPressedKeys(keys => new Set(keys).add(keypadIndex));
  };
  const release = (keypadIndex: Chip8KeypadIndex) => {
    releaseKey(keypadIndex);
    setPressedKeys(keys => {
      const nextKeys = new Set(keys);
      nextKeys.delete(keypadIndex);
      return nextKeys;
    });
  };

  const resetGame = () => {
    resetVm();
    setPressedKeys(new Set());
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const keypadIndex = inputsMap[event.code];
    if (!isDefined(keypadIndex)) {
      return;
    }
    event.preventDefault(); // arrow keys would scroll the page
    if (event.repeat) {
      return;
    }
    press(keypadIndex);
  };
  const handleKeyUp = (event: KeyboardEvent<HTMLDivElement>) => {
    const keypadIndex = inputsMap[event.code];
    if (!isDefined(keypadIndex)) {
      return;
    }
    release(keypadIndex);
  };
  const handleBlur = (event: FocusEvent<HTMLDivElement>) => {
    // focus moving to a child (e.g. an on-screen control) keeps the game running
    if (event.currentTarget.contains(event.relatedTarget)) {
      return;
    }
    setIsPlaying(false);
    // the matching keyup events will not reach us anymore: release everything
    releaseAllKeys();
    setPressedKeys(new Set());
  };
  // Some browsers (e.g. Safari, on iOS especially) do not focus on click: do it ourselves.
  const handleClick = () => {
    const player = playerRef.current;
    if (player && !player.contains(document.activeElement)) {
      player.focus({ preventScroll: true });
    }
  };

  return (
    <div
      ref={playerRef}
      role="group"
      aria-label="Tetris, running on the CHIP-8 virtual machine"
      tabIndex={0}
      className="mx-auto flex w-fit flex-col gap-3 outline-none"
      onKeyDown={handleKeyDown}
      onKeyUp={handleKeyUp}
      onFocus={() => setIsPlaying(true)}
      onBlur={handleBlur}
      onClick={handleClick}
    >
      <div className="flex items-baseline justify-between">
        <span className="font-semibold text-white">Tetris</span>
        {isPlaying ? (
          <span className="text-gray-lighter flex items-center gap-2 text-sm">
            <span className="bg-orange h-2 w-2 self-center rounded-full" />
            <span className="font-semibold text-white">Playing</span>
            Click anywhere else to pause
          </span>
        ) : (
          <span className="text-gray-lighter text-sm">Click the screen to play</span>
        )}
      </div>

      <div className={clsx("relative", isPlaying && "outline-orange outline-2 outline-offset-4")}>
        <div ref={containerRef} />
        {!isPlaying && (
          <div className="absolute inset-0 flex cursor-pointer flex-col items-center justify-center gap-3 bg-black/75 text-white">
            <span className="bg-orange flex h-16 w-16 items-center justify-center rounded-full text-black">
              <Chip8Icon name="play" className="h-7 w-7" />
            </span>
            <span className="text-lg font-semibold">Click to play Tetris</span>
            <div className="flex flex-wrap justify-center gap-x-5 gap-y-2 px-4 text-sm">
              {TETRIS_CONTROLS.map(control => (
                <span key={control.keypadIndex} className="flex items-center gap-1.5">
                  <ControlKeys control={control} />
                  <span className="ml-0.5">{control.label}</span>
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="mt-2 flex flex-wrap items-center justify-between gap-x-12 gap-y-6">
        <div className="grid h-36 w-56 shrink-0 grid-cols-3 grid-rows-2 gap-2">
          {TETRIS_CONTROLS.map(control => {
            const isPressed = pressedKeys.has(control.keypadIndex);
            return (
              <Chip8Key
                key={control.keypadIndex}
                aria-label={control.description}
                className={clsx(
                  "flex flex-col items-center justify-center gap-1.5 rounded-lg text-xs font-semibold",
                  isPressed ? "bg-orange text-black" : "bg-space text-white",
                )}
                style={{ gridColumn: control.gridColumn, gridRow: control.gridRow }}
                onPressed={() => press(control.keypadIndex)}
                onReleased={() => release(control.keypadIndex)}
              >
                <Chip8Icon name={control.icon} className={clsx("h-6 w-6", !isPressed && "text-orange")} />
                {control.label}
              </Chip8Key>
            );
          })}
        </div>
        <div className="flex flex-col gap-2.5">
          <span className="text-gray-lighter text-xs font-semibold tracking-wider uppercase">Keyboard</span>
          {TETRIS_CONTROLS.map(control => (
            <div key={control.keypadIndex} className="flex items-center gap-2">
              <ControlKeys control={control} />
              <span className="ml-1.5 text-sm">{control.description}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-x-6">
        <button
          type="button"
          aria-expanded={isKeypadShown}
          className="text-light-orange hover:text-orange flex min-h-11 items-center gap-1.5 text-sm"
          onClick={() => setIsKeypadShown(isShown => !isShown)}
        >
          <Chip8Icon
            name="chevron"
            className={clsx("h-3.5 w-3.5 transition-transform", isKeypadShown && "rotate-90")}
          />
          {isKeypadShown ? "Hide the full CHIP-8 keypad" : "Show the full CHIP-8 keypad"}
        </button>
        <button
          type="button"
          className="text-light-orange hover:text-orange flex min-h-11 items-center gap-1.5 text-sm"
          onClick={resetGame}
        >
          <Chip8Icon name="reset" className="h-3.5 w-3.5" />
          Reset game
        </button>
      </div>
      {isKeypadShown && (
        <div className="flex flex-wrap items-start gap-8">
          <Chip8Keypad onKeyPressed={press} onKeyReleased={release} pressedKeys={pressedKeys} />
          <p className="text-gray-lighter m-0 max-w-xs text-sm">
            The complete 16-key CHIP-8 keypad. Tetris only reads the four keys above.
          </p>
        </div>
      )}
    </div>
  );
};
