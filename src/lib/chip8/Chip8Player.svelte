<script lang="ts">
  import { onMount } from "svelte";
  import { browser } from "$app/environment";
  import { select } from "d3-selection";

  import { isDefined } from "../../utils";
  import { type Chip8ExecutionContext, Chip8VirtualMachine } from "./vm";
  import { chip8AzertyInputsMap, chip8QwertyInputsMap } from "./input";
  import { DISPLAY_WIDTH, DISPLAY_HEIGHT, Chip8Display } from "./display";

  interface ColorRGB {
    r: number;
    g: number;
    b: number;
  }

  /** Size (in pixels) of an individual virtual CHIP-8 pixel. */
  export let scale: number = 16;

  /** Rendering color for OFF pixels. */
  export let offColor: ColorRGB = {
    r: 43,
    g: 43,
    b: 45,
  };
  /** Rendering color for ON pixels. */
  export let onColor: ColorRGB = {
    r: 255,
    g: 255,
    b: 255,
  };

  // CHIP-8 virtual machine timing
  const VM_TICK_RATE_MS = 1000 / 60;
  const VM_CPU_TICK_RATE_MS = 1000 / 240;
  // CHIP-8 virtual machine management
  export let dataROM: Uint8Array = new Uint8Array();
  let refreshDisplay = (_display: Chip8Display) => {};
  let [running, isWaitingForKey] = [false, false];
  const context: Chip8ExecutionContext = {
    onWaitingForKey: () => {
      isWaitingForKey = true;
    },
  };
  const vm = new Chip8VirtualMachine(context);
  const run = () => {
    vm.loadROM(dataROM);
    running = true;
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
  };

  // CHIP-8 input management
  let isPlayerFocused = false;
  export let inputScheme: "QWERTY" | "AZERTY" = "QWERTY";
  $: inputsMap = inputScheme === "QWERTY" ? chip8QwertyInputsMap : chip8AzertyInputsMap;
  onMount(() => {
    if (!browser || typeof document === "undefined") {
      return;
    }
    let latestEventKeyCode: string | null = null;
    const handleKeydownEvent = (event: KeyboardEvent) => {
      const { code } = event;
      if (!isPlayerFocused || code === latestEventKeyCode) {
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
        isWaitingForKey = false;
      }
    };
    document.addEventListener("keydown", handleKeydownEvent);
  });

  // CHIP-8 display rendering
  let containerEl: HTMLElement;
  onMount(() => {
    // sanity check
    if (!browser || !containerEl) {
      return;
    }
    const container = select(containerEl);
    container.selectAll("*").remove();

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

    // rendering function
    refreshDisplay = display => {
      if (!display.data.isDirty) {
        return;
      }
      const offColorString = `rgb(${offColor.r}, ${offColor.g}, ${offColor.b})`;
      const onColorString = `rgb(${onColor.r}, ${onColor.g}, ${onColor.b})`;

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
    };

    // TODO: add trigger button
    run();
  });
</script>

<div
  bind:this={containerEl}
  on:click={() => {
    isPlayerFocused = true;
  }}
  on:focus={() => {
    isPlayerFocused = true;
  }}
  on:blur={() => {
    isPlayerFocused = false;
  }}
  class="container"
/>

<style lang="postcss">
  .container {
    @apply rounded;
  }
</style>
