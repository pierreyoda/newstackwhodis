import { select } from "d3-selection";
import { FunctionComponent, useEffect, useMemo, useRef } from "react";

import { LSystemTrace } from "@/content/lsystem/lsystem";

const LSYSTEM_STATE_DISPLAY_CUTOFF = 50;

interface LSystemTracingRendererProps {
  trace: LSystemTrace;
  // rendering parameters
  scale: number;
  strokeWidth: number;
  strokeColor: string;
  showCurrentState?: boolean;
  showGenerationLabel?: boolean;
}

export const LSystemTracingRenderer: FunctionComponent<LSystemTracingRendererProps> = ({
  trace,
  scale = 1.0,
  strokeWidth = 0.0075,
  strokeColor = "#141416",
  showCurrentState = false,
  showGenerationLabel = false,
}) => {
  const shortenedState = useMemo(
    () => trace.forState.length > LSYSTEM_STATE_DISPLAY_CUTOFF
      ? `${trace.forState.substring(0, LSYSTEM_STATE_DISPLAY_CUTOFF)} ...`
      : trace.forState,
    [trace.forState],
  );

  const svgRef = useRef<SVGSVGElement | null>(null);
  useEffect(
    () => {
      if (!svgRef) {
        return;
      }
      const svg = select(svgRef.current);

      // cleanup
      svg.selectAll("*").remove();


      // SVG path elements
      const line = new Array<string>(trace.positions.length);
      for (const [i, { x, y }] of trace.positions.entries()) {
        const type = i === 0 ? "M" : "L";
        line[i] = `${type}${x * scale},${y * scale}`;
      }

      // viewport
      svg
        .attr("viewBox", [0, 0, trace.width * scale, trace.height * scale].join(" "))
        .style("height", `${(100 * trace.height) / trace.width}%`);

      // SVG path
      svg
        .append("path")
        .attr("d", line.join(", "))
        .attr("stroke", strokeColor)
        .attr("stroke-width", strokeWidth)
        .attr("fill", "none");
    },
    [trace],
  );

  return (
    <div className="lsystem-renderer-container">
      {showCurrentState && (
        <div className="meta">
          <span className="label">State:&nbsp;</span>
          {shortenedState}
        </div>
      )}
      {showGenerationLabel && (
        <div className="meta">
          <span className="label">Generation:&nbsp;</span>
          {trace.forGeneration}
        </div>
      )}
      <svg ref={svgRef} />
    </div>
  );
};
