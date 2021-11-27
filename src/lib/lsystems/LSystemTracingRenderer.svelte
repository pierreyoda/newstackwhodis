<script lang="ts">
  import { onMount } from "svelte";
  import { select } from "d3-selection";
  import type { LSystem, LSystemTrace } from "./lsystem";

  export let trace: LSystemTrace;
  export let lsystem: LSystem<string>;

  onMount(() => {
    const svg = select("svg");
    svg.selectAll("*").remove();

    // svg path elements
    const line = [];
    for (const [i, { x, y }] of trace.positions.entries()) {
      const type = i === 0 ? "M" : "L";
      line.push(`${type}${x},${y}`);
    }

    // viewport
    svg
      .attr("viewBox", [0, 0, trace.width, trace.height].join(" "))
      .style("height", `${(100 * trace.height) / trace.width}px`);

    // assembly
    svg
      .append("path")
      .attr("d", line.join(", "))
      .attr("stroke", "black")
      .attr("stroke-width", 0.1)
      .attr("fill", "none");
  });
</script>

<div class="container">
  <svg />
</div>

<style lang="postcss">
  .container {
    @apply p-3 bg-white;
  }
</style>
