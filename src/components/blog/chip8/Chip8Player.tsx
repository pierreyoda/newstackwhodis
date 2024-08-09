import { select } from "d3-selection";
import { FunctionComponent, useCallback, useEffect, useMemo, useRef, useState } from "react";

import { isDefined } from "@/utils";
import { Chip8Keypad } from "./Chip8Keypad";
import { Chip8ExecutionContext, Chip8VirtualMachine } from "@/content/chip8/vm";
import { chip8AzertyInputsMap, chip8QwertyInputsMap } from "@/content/chip8/input";
import { Chip8Display, DISPLAY_HEIGHT, DISPLAY_WIDTH } from "@/content/chip8/display";

interface ColorRGB {
  r: number;
  g: number;
  b: number;
}
const stringifyColorRGB = ({ r, g, b }: ColorRGB) => `rgb(${r}, ${g}, ${b})`;

// CHIP-8 virtual machine timing
const VM_TICK_RATE_MS = 1000 / 60;
const VM_CPU_TICK_RATE_MS = 1000 / 240;

interface Chip8PlayerProps {
  /** ROM content to play. */
  rom: Uint8Array;
  /** Size (in pixels) of an individual virtual CHIP-8 pixel. */
  scale: number;
  /** Rendering color for OFF pixels. */
  offColor: ColorRGB;
  /** Rendering color for ON pixels. */
  onColor: ColorRGB;
  /** Keypad input mapping scheme. */
  inputScheme?: "QWERTY" | "AZERTY";
  /** Hide CHIP-8 virtual keypad? */
  disableKeypad?: boolean;
}

export const Chip8Player: FunctionComponent<Chip8PlayerProps> = ({
  rom,
  scale = 16,
  offColor = { r: 43, g: 43, b: 45 },
  onColor = { r: 255, g: 255, b: 255 },
  inputScheme = "QWERTY",
  disableKeypad = false,
}) => {
  // Display & input management
  const containerRef = useRef<HTMLDivElement>(null);
  const offColorString = useMemo(() => stringifyColorRGB(offColor), [offColor]);
  const onColorString = useMemo(() => stringifyColorRGB(onColor), [onColor]);
  const refreshDisplay = useRef<(display: Chip8Display) => void>(() => { });
  const [isFocused, setIsFocused] = useState(false);
  const [isWaitingForKey, setIsWaitingForKey] = useState(false);
  const inputsMap = useMemo(
    () => inputScheme === "QWERTY" ? chip8QwertyInputsMap : chip8AzertyInputsMap,
    [inputScheme],
  );
  useEffect(
    () => {
      // sanity check
      if (typeof window === "undefined" || !containerRef.current) {
        return;
      }
      const container = select(containerRef.current);
      container.selectAll("*").remove(); // cleanup

      // canvas creation
      const [canvasWidth, canvasHeight] = [DISPLAY_WIDTH * scale, DISPLAY_HEIGHT * scale];
      const canvas = container
        .append("canvas")
        .attr("width", DISPLAY_WIDTH * scale)
        .attr("height", DISPLAY_HEIGHT * scale);
      const context = canvas.node()?.getContext("2d");
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

        // input handling
        setIsFocused(false);
        let latestEventKeyCode: string | null = null;
        const handleKeydownEvent = (event: KeyboardEvent) => {
          const { code } = event;
          if (!isFocused || code === latestEventKeyCode) {
            return;
          }
          const keypadIndex = inputsMap[code];
          if (!isDefined(keypadIndex)) {
            return;
          }
          latestEventKeyCode = code;
          for (let i = 0x0; i <= 0xf; i++) {
            vm.keypad.setIsKeyPressed(i, false);
          }
          vm.keypad.setIsKeyPressed(keypadIndex, true);
          if (isWaitingForKey) {
            vm.endWaitingForKey(keypadIndex);
            setIsWaitingForKey(false);
          }
        };
        document.addEventListener("keydown", handleKeydownEvent);

        // clean-up
        return () => document.removeEventListener("keydown", handleKeydownEvent);
      };
    },
    [scale],
  );

  const running = useRef(false);
  const vm = useMemo<Chip8VirtualMachine>(() => {
    const context: Chip8ExecutionContext = {
      onWaitingForKey: () => setIsWaitingForKey(true),
    };
    return new Chip8VirtualMachine(context);
  }, []);

  // VM
  const [intervalHandleTimers, setIntervalHandleTimers] = useState<NodeJS.Timeout | null>(null);
  const [intervalHandleCpu, setIntervalHandleCpu] = useState<NodeJS.Timeout | null>(null);
  const run = useCallback(
    () => {
      // clean-up
      if (intervalHandleTimers) {
        clearInterval(intervalHandleTimers);
      }
      if (intervalHandleCpu) {
        clearInterval(intervalHandleCpu);
      }

      // ROM loading
      if (!rom) {
        throw new Error("Chip8Player: invalid ROM data");
      }
      vm.loadROM(rom);
      running.current = true;

      // timers
      const timersCycle = () => {
        if (!running.current) {
          return;
        }
        vm.tick();
      };
      setIntervalHandleTimers(setInterval(timersCycle, VM_TICK_RATE_MS));

      // CPU
      const cpuCycle = () => {
        if (!running.current || isWaitingForKey) {
          return;
        }
        vm.step();
        if (vm.display.data.isDirty) {
          refreshDisplay.current?.(vm.display);
        }
      };
      setIntervalHandleCpu(setInterval(cpuCycle, VM_CPU_TICK_RATE_MS));
    },
    [rom],
  );

  useEffect(() => run(), [run]);

  return (
    <div className="flex flex-col md:flex-row">
      <div
        ref={containerRef}
        onClick={() => setIsFocused(true)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
      {!disableKeypad && (
        <Chip8Keypad onKeyPressed={vm.endWaitingForKey.bind(vm)} />
      )}
    </div>
  );
};
