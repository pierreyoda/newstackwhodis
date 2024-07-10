import { select } from "d3-selection";
import { FunctionComponent, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";

import { Chip8ExecutionContext, Chip8VirtualMachine } from "@/content/chip8/vm";
import { Chip8Display, DISPLAY_HEIGHT, DISPLAY_WIDTH } from "@/content/chip8/display";
import { Chip8Keypad } from "./Chip8Keypad";
import { chip8AzertyInputsMap, chip8QwertyInputsMap } from "@/content/chip8/input";

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
  const [renderingContext, setRenderingContext] = useState<CanvasRenderingContext2D | null>(null);
  const [refreshDisplay, setRefreshDisplay] = useState<(display: Chip8Display) => void>(() => { });
  const inputsMap = useMemo(
    () => inputScheme === "QWERTY" ? chip8QwertyInputsMap : chip8AzertyInputsMap,
    [inputScheme],
  );
  useLayoutEffect(
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
      setRenderingContext(context);

      // canvas rendering
      setRefreshDisplay((display: Chip8Display) => {
        if (!display.data.isDirty || !renderingContext) {
          return;
        }

        renderingContext.fillStyle = offColorString;
        renderingContext.clearRect(0, 0, canvasWidth, canvasHeight);
        renderingContext.fillStyle = onColorString;
        for (let y = 0; y < DISPLAY_HEIGHT; y++) {
          const canvasY = y * scale;
          for (let x = 0; x < DISPLAY_WIDTH; x++) {
            const virtualPixel = display.data.gfx[y][x];
            if (virtualPixel === 0) {
              continue;
            }
            renderingContext.fillRect(x * scale, canvasY, scale, scale);
          }
        }

        // input handling
      });
    },
    [scale],
  );

  const [running, setRunning] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isWaitingForKey, setIsWaitingForKey] = useState(false);
  const vm = useMemo<Chip8VirtualMachine>(() => {
    const context: Chip8ExecutionContext = {
      onWaitingForKey: () => setIsWaitingForKey(true),
    };
    return new Chip8VirtualMachine(context);
  }, []);

  // VM
  const run = useCallback(
    () => {
      vm.loadROM(rom);
      setRunning(true);

      // timers
      const timersCycle = () => {
        if (!running) {
          return;
        }
        vm.tick();
        setTimeout(timersCycle, VM_TICK_RATE_MS);
      };
      setTimeout(timersCycle, VM_TICK_RATE_MS);

      // CPU
      const cpuCycle = () => {
        if (!running || isWaitingForKey) {
          return;
        }
        vm.step();
        if (vm.display.data.isDirty) {
          refreshDisplay(vm.display);
        }
        setTimeout(cpuCycle, VM_CPU_TICK_RATE_MS);
      };
      setTimeout(cpuCycle, VM_CPU_TICK_RATE_MS);
    },
    [rom],
  );

  useEffect(() => run(), [run]);

  return (
    <div className="flex flex-col md:flex-row">
      <div
        ref={containerRef}
        onClick={() => { setIsFocused(true) }}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
      {!disableKeypad && (
        <Chip8Keypad onKeyPressed={vm.endWaitingForKey} />
      )}
    </div>
  );
};