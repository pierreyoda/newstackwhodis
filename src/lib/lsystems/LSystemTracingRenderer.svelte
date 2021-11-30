<script lang="ts">
  import { beforeUpdate } from "svelte";
  import { select } from "d3-selection";
  import type { LSystemTrace } from "./lsystem";

  // L-System trace
  export let trace: LSystemTrace;
  // rendering parameters
  export let scale: number = 1.0;
  export let strokeWidth: number = 0.0075;
  export let strokeColor: string = "#141416";
  export let showCurrentState: boolean = false;
  export let showGenerationLabel: boolean = false;

  let svgEl;

  beforeUpdate(() => {
    if (!svgEl) {
      return;
    }
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
  {#if showCurrentState}
    <p class="meta">
      <span class="label">State: </span>
      {shortenedState}
    </p>
  {/if}
  {#if showGenerationLabel}
    <p class="meta">
      <span class="label">Generation: </span>
      {trace.forGeneration}
    </p>
  {/if}
  <svg bind:this={svgEl} />
</div>

<style lang="postcss">
  .container {
    @apply rounded p-3 bg-white text-black;
    .meta {
      @apply hidden w-full items-center justify-center;
      &:last-of-type {
        @apply mb-4;
      }
      .label {
        @apply text-gray-lighter;
        @apply mr-2;
      }
    }
  }

  @screen md {
    .container {
      .meta {
        @apply flex;
      }
    }
  }
</style>
