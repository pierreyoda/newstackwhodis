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
    () =>
      trace.forState.length > LSYSTEM_STATE_DISPLAY_CUTOFF
        ? `${trace.forState.substring(0, LSYSTEM_STATE_DISPLAY_CUTOFF)} ...`
        : trace.forState,
    [trace.forState],
  );

  const svgRef = useRef<SVGSVGElement>(null);
  useEffect(() => {
    if (!svgRef.current) {
      return;
    }
    const svg = svgRef.current;

    // cleanup
    for (const svgChild of svg.children) {
      svg.removeChild(svgChild);
    }

    // SVG path elements
    const line = new Array<string>(trace.positions.length);
    for (const [i, { x, y }] of trace.positions.entries()) {
      const type = i === 0 ? "M" : "L";
      line[i] = `${type}${x * scale},${y * scale}`;
    }

    // viewport
    svg.setAttribute("viewBox", [0, 0, trace.width * scale, trace.height * scale].join(" "));
    svg.style["height"] = `${(100 * trace.height) / trace.width}%`;

    // SVG path
    const svgPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
    svgPath.setAttribute("d", line.join(", "));
    svgPath.setAttribute("stroke", strokeColor);
    svgPath.setAttribute("stroke-width", strokeWidth.toString());
    svgPath.setAttribute("fill", "none");
    svg.appendChild(svgPath);
  }, [trace]);

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
