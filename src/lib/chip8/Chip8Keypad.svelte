<script lang="ts">
  import Chip8Key from "./Chip8Key.svelte";
  import { chip8KeypadIndices, type Chip8KeypadIndex } from "./input";

  export let onKeyPressed: (key: Chip8KeypadIndex) => void = () => {};

  const labelsPerKey: Record<Chip8KeypadIndex, string> = {
    0x0: "1",
    0x1: "2",
    0x2: "3",
    0x3: "4",
    0x4: "Q",
    0x5: "W",
    0x6: "E",
    0x7: "R",
    0x8: "A",
    0x9: "S",
    0xa: "D",
    0xb: "F",
    0xc: "Z",
    0xd: "X",
    0xe: "C",
    0xf: "V",
  };
</script>

<div class="container">
  {#each chip8KeypadIndices as chip8KeypadIndex}
    <Chip8Key onPressed={() => onKeyPressed(chip8KeypadIndex)} label={labelsPerKey[chip8KeypadIndex]} />
  {/each}
</div>

<style lang="postcss">
  .container {
    @apply grid grid-rows-4 grid-cols-4 gap-x-12 gap-y-4;
  }

  @screen md {
    .container {
      @apply gap-y-2;
    }
  }
</style>
