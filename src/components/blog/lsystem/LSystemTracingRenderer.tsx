import { FunctionComponent, useEffect, useMemo, useRef, useState } from "react";

import { LSystemTrace } from "@/content/lsystem/lsystem";

const LSYSTEM_STATE_DISPLAY_CUTOFF = 50;

/**
 * Thinnest on-screen stroke, in CSS pixels.
 *
 * The stroke width is in drawing units, and the drawing doubles or triples in size with each generation:
 * once scaled down to fit the screen, high generations would otherwise fade out to (almost) nothing.
 */
const MIN_STROKE_WIDTH_PX = 1;

/** Fixed precision, so that the server-rendered SVG is identical to the client-rendered one. */
const round = (value: number) => Math.round(value * 100) / 100;

interface LSystemTracingRendererProps {
  trace: LSystemTrace;
  // rendering parameters
  scale: number;
  /** In drawing units, i.e. relative to the length of a single segment (before scaling). */
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

  // Rendered declaratively (rather than in an effect), so that the drawing is part of the server-rendered HTML.
  const { width, height, pathData } = useMemo(
    () => ({
      width: round(trace.width * scale),
      height: round(trace.height * scale),
      pathData: trace.positions
        .map(({ x, y }, i) => `${i === 0 ? "M" : "L"}${round(x * scale)},${round(y * scale)}`)
        .join(""),
    }),
    [trace, scale],
  );

  // On-screen width of the drawing, to keep its stroke visible however much it is scaled down.
  const svgRef = useRef<SVGSVGElement>(null);
  const [renderedWidth, setRenderedWidth] = useState<number | null>(null);
  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) {
      return;
    }
    const observer = new ResizeObserver(([entry]) => setRenderedWidth(entry.contentRect.width));
    observer.observe(svg);
    return () => observer.disconnect();
  }, []);
  const minStrokeWidth = renderedWidth ? (MIN_STROKE_WIDTH_PX * width) / renderedWidth : 0;

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
      <svg ref={svgRef} viewBox={`0 0 ${width} ${height}`} className="h-auto w-full">
        <path d={pathData} fill="none" stroke={strokeColor} strokeWidth={Math.max(strokeWidth, minStrokeWidth)} />
      </svg>
    </div>
  );
};
