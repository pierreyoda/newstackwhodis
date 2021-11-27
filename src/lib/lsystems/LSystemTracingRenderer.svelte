<script lang="ts">
  import { onMount } from "svelte";
  import { select } from "d3-selection";
  import type { LSystem, LSystemTrace } from "./lsystem";

  export let scale: number = 1.0;
  export let trace: LSystemTrace;
  export let lsystem: LSystem<string>;

  onMount(() => {
    const svg = select("svg");
    svg.selectAll("*").remove();

    // svg path elements
    const line = [];
    for (const [i, { x, y }] of trace.positions.entries()) {
      const type = i === 0 ? "M" : "L";
      line.push(`${type}${x * scale},${y * scale}`);
    }

    // viewport
    svg
      .attr("viewBox", [0, 0, trace.width * scale, trace.height * scale].join(" "))
      .style("height", `${(100 * trace.height) / trace.width}%`);

    // assembly
    svg
      .append("path")
      .attr("d", line.join(", "))
      .attr("stroke", "#141416")
      .attr("stroke-width", 0.0075)
      .attr("fill", "none");
  });

  const LSYSTEM_STATE_DISPLAY_CUTOFF = 50;
  $: shortenedState =
    trace.forState.length > LSYSTEM_STATE_DISPLAY_CUTOFF
      ? `${trace.forState.substring(0, LSYSTEM_STATE_DISPLAY_CUTOFF)} ...`
      : trace.forState;
</script>

<div class="container">
  <p class="meta">
    <span class="label">State: </span>
    <span title={trace.forState}>{shortenedState}</span>
  </p>
  <p class="meta">
    <span class="label">Generation: </span>
    {trace.forGeneration}
  </p>
  <svg class="transform scale-50" />
</div>

<style lang="postcss">
  .container {
    @apply rounded p-3 bg-white text-black;
    .meta {
      @apply w-full flex items-center justify-center;
      &:last-of-type {
        @apply mb-4;
      }
      .label {
        @apply text-gray-lighter;
        @apply mr-2;
      }
    }
  }
</style>
