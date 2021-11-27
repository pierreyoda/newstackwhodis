<script lang="ts">
  import { onMount } from "svelte";
  import { select } from "d3-selection";
  import type { LSystemTrace } from "./lsystem";

  // L-System trace
  export let trace: LSystemTrace;
  // rendering parameters
  export let scale: number = 1.0;
  export let strokeWidth: number = 0.0075;
  export let strokeColor: string = "#141416";

  let svgEl;

  onMount(() => {
    const svg = select(svgEl);
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
      .attr("stroke", strokeColor)
      .attr("stroke-width", strokeWidth)
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
  <svg bind:this={svgEl} />
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
