<script lang="ts">
  // documentation: https://simeydotme.github.io/svelte-range-slider-pips/
  import RangeSlider from "svelte-range-slider-pips";

  import LSystemTracingRenderer from "./LSystemTracingRenderer.svelte";
  import { iteratedLSystem, LSystem, LSystemTrace, traceLSystem } from "./lsystem";

  export let lsystem: LSystem<string>;
  export let initialAngle: number = 0;
  // controls
  export let minGeneration: number = 0;
  export let maxGeneration: number = 6;
  // renderer controls
  export let scale: number = 1.0;
  export let strokeWidthScale: (generation: number) => number;
  export let strokeColor: string = "#141416";

  export let initialGeneration: number = 2;
  let forGeneration = initialGeneration;

  const statesPerGeneration: Record<number, string> = {};

  // TODO: debouncing?
  $: currentLSystemTrace = ((): LSystemTrace => {
    let currentLSystem = { ...lsystem };
    for (let currentGeneration = 0; currentGeneration <= forGeneration; currentGeneration++) {
      if (!statesPerGeneration[currentGeneration]) {
        statesPerGeneration[currentGeneration] = iteratedLSystem(currentLSystem);
      }
      currentLSystem.generation = currentGeneration;
      currentLSystem.state = statesPerGeneration[currentGeneration];
    }
    return traceLSystem(currentLSystem, initialAngle);
  })();
  $: strokeWidth = strokeWidthScale(forGeneration);
</script>

<div class="container">
  <div class="controls-container">
    <span class="control-label">Generation: </span>
    <RangeSlider
      float
      range="min"
      pips
      all="label"
      pipstep={Math.round(maxGeneration / (minGeneration + 1))}
      min={minGeneration}
      max={maxGeneration}
      step={1}
      values={[forGeneration]}
      on:change={event => {
        forGeneration = event.detail?.value ?? initialGeneration;
      }}
      springValues={{ stiffness: 1, damping: 1 }}
    />
  </div>
  <div class="viewer">
    <LSystemTracingRenderer
      trace={currentLSystemTrace}
      {scale}
      {strokeWidth}
      {strokeColor}
      showGenerationLabel={false}
    />
  </div>
</div>

<style lang="postcss">
  .container {
    .viewer {
      @apply mt-6;
    }

    :global(.rangeSlider .pipVal) {
      @apply text-white;
    }
  }
</style>
