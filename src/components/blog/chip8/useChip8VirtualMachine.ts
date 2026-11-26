import { useEffect, useMemo, useRef } from "react";

import { Chip8KeypadIndex } from "@/content/chip8/input";
import { Chip8VirtualMachine } from "@/content/chip8/vm";
import { Chip8Display, DISPLAY_HEIGHT, DISPLAY_WIDTH } from "@/content/chip8/display";

export interface ColorRGB {
  r: number;
  g: number;
  b: number;
}
const stringifyColorRGB = ({ r, g, b }: ColorRGB) => `rgb(${r}, ${g}, ${b})`;

const DEFAULT_OFF_COLOR: ColorRGB = { r: 43, g: 43, b: 45 };
const DEFAULT_ON_COLOR: ColorRGB = { r: 255, g: 255, b: 255 };

// CHIP-8 virtual machine timing
const VM_TIMERS_RATE_HZ = 60;
const VM_CPU_RATE_HZ = 240;

/** Frames run right after loading a ROM even while paused, so that its first screen gets drawn. */
const BOOT_FRAMES = 30;

// Tap-to-step input.
// ROMs like Tetris act on every frame a key is held with no initial delay, so a ~100ms tap
// would move a piece twice. Instead, a new press is shown to the ROM for TAP_FRAMES only,
// and then continuously, if the key is still held, from REPEAT_DELAY_FRAMES after the press.
const TAP_FRAMES = 2;
const REPEAT_DELAY_FRAMES = 15; // 250ms at 60Hz

interface TrackedKey {
  pressedAtFrame: number;
  isHeld: boolean;
}

interface UseChip8VirtualMachineOptions {
  /** ROM content to play. */
  rom: Uint8Array;
  /** Size (in pixels) of an individual virtual CHIP-8 pixel. */
  scale: number;
  /** Rendering color for OFF pixels. */
  offColor?: ColorRGB;
  /** Rendering color for ON pixels. */
  onColor?: ColorRGB;
  /**
   * CPU speed factor (1 i.e. 240 instructions per second, 2 for double speed).
   * Delay and sound timers always run at 60Hz.
   */
  vmTickRateMsFactor: number;
  /** Stop running the VM (once booted, see `BOOT_FRAMES`). */
  isPaused?: boolean;
  /** Turn short key presses into single steps (see `TAP_FRAMES`). */
  tapToStep?: boolean;
}

/**
 * Runs a CHIP-8 virtual machine, rendering its display in a canvas appended to `containerRef`.
 */
export const useChip8VirtualMachine = ({
  rom,
  scale,
  offColor = DEFAULT_OFF_COLOR,
  onColor = DEFAULT_ON_COLOR,
  vmTickRateMsFactor,
  isPaused = false,
  tapToStep = false,
}: UseChip8VirtualMachineOptions) => {
  // Display
  const containerRef = useRef<HTMLDivElement>(null);
  const offColorString = useMemo(() => stringifyColorRGB(offColor), [offColor]);
  const onColorString = useMemo(() => stringifyColorRGB(onColor), [onColor]);
  const refreshDisplay = useRef<(display: Chip8Display) => void>(() => {});
  useEffect(() => {
    // sanity check
    if (typeof window === "undefined" || !containerRef.current) {
      return;
    }
    const container = containerRef.current;

    // cleanup
    for (const containerChild of container.children) {
      container.removeChild(containerChild);
    }

    // canvas creation
    const [canvasWidth, canvasHeight] = [DISPLAY_WIDTH * scale, DISPLAY_HEIGHT * scale];
    const canvas = document.createElement("canvas");
    canvas.setAttribute("width", `${DISPLAY_WIDTH * scale}`);
    canvas.setAttribute("height", `${DISPLAY_HEIGHT * scale}`);
    container.appendChild(canvas);
    const context = canvas.getContext("2d");
    if (!context) {
      return;
    }

    // canvas rendering
    refreshDisplay.current = (display: Chip8Display) => {
      if (!display) {
        return;
      }
      if (!display.data.isDirty || !context) {
        return;
      }

      context.fillStyle = offColorString;
      context.clearRect(0, 0, canvasWidth, canvasHeight);
      context.fillStyle = onColorString;
      for (let y = 0; y < DISPLAY_HEIGHT; y++) {
        const canvasY = y * scale;
        for (let x = 0; x < DISPLAY_WIDTH; x++) {
          const virtualPixel = display.data.gfx[y][x];
          if (virtualPixel === 0) {
            continue;
          }
          context.fillRect(x * scale, canvasY, scale, scale);
        }
      }
      display.data.isDirty = false;
    };
  }, [scale]);

  // VM
  const vm = useMemo(() => new Chip8VirtualMachine(), []);
  const frameCounter = useRef(0);
  const trackedKeys = useRef(new Map<Chip8KeypadIndex, TrackedKey>());
  const isPausedRef = useRef(isPaused);
  useEffect(() => {
    isPausedRef.current = isPaused;
  }, [isPaused]);

  useEffect(() => {
    if (!rom) {
      throw new Error("Chip8Player: invalid ROM data");
    }
    vm.loadROM(rom);
    frameCounter.current = 0;
    trackedKeys.current.clear();

    // Browsers clamp setInterval to ~4ms, so running one instruction per callback caps the CPU
    // at ~240Hz whatever the speed factor. Instead, each 60Hz frame ticks the timers once and
    // runs as many instructions as the speed factor requires (fractions carry over).
    const cpuCyclesPerFrame = (VM_CPU_RATE_HZ / VM_TIMERS_RATE_HZ) * vmTickRateMsFactor;
    let pendingCpuCycles = 0;
    const frame = () => {
      if (isPausedRef.current && frameCounter.current >= BOOT_FRAMES) {
        return;
      }
      const currentFrame = frameCounter.current++;
      if (tapToStep) {
        for (const [keypadIndex, key] of trackedKeys.current) {
          const age = currentFrame - key.pressedAtFrame;
          vm.keypad.setIsKeyPressed(keypadIndex, age < TAP_FRAMES || (key.isHeld && age >= REPEAT_DELAY_FRAMES));
          if (!key.isHeld && age >= TAP_FRAMES) {
            trackedKeys.current.delete(keypadIndex);
          }
        }
      }
      vm.tick();
      pendingCpuCycles += cpuCyclesPerFrame;
      for (; pendingCpuCycles >= 1; pendingCpuCycles--) {
        vm.step();
      }
      if (vm.display.data.isDirty) {
        refreshDisplay.current(vm.display);
      }
    };
    const intervalHandle = setInterval(frame, 1000 / VM_TIMERS_RATE_HZ);

    return () => clearInterval(intervalHandle);
  }, [vm, rom, vmTickRateMsFactor, tapToStep]);

  // Input. ROMs poll the keypad state (EX9E / EXA1), so keys must stay pressed until released.
  const pressKey = (keypadIndex: Chip8KeypadIndex) => {
    if (tapToStep) {
      if (trackedKeys.current.get(keypadIndex)?.isHeld) {
        return;
      }
      trackedKeys.current.set(keypadIndex, { pressedAtFrame: frameCounter.current, isHeld: true });
    }
    vm.keypad.setIsKeyPressed(keypadIndex, true);
    if (vm.data.waitingForKeyRegisterIndex !== null) {
      vm.endWaitingForKey(keypadIndex);
    }
  };
  const releaseKey = (keypadIndex: Chip8KeypadIndex) => {
    const trackedKey = trackedKeys.current.get(keypadIndex);
    if (trackedKey) {
      // released by the frame loop, once the ROM has seen the tap
      trackedKey.isHeld = false;
      return;
    }
    vm.keypad.setIsKeyPressed(keypadIndex, false);
  };
  const releaseAllKeys = () => {
    trackedKeys.current.clear();
    for (let i = 0x0; i <= 0xf; i++) {
      vm.keypad.setIsKeyPressed(i, false);
    }
  };

  return { containerRef, pressKey, releaseKey, releaseAllKeys };
};
