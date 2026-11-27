import { FunctionComponent, useEffect, useMemo, useRef, useState } from "react";

import { LSystemTrace } from "@/content/lsystem/lsystem";

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
  /** Drawing units per segment. */
  scale?: number;
  /** In drawing units (a segment being `scale` long). */
  strokeWidth?: number;
  /** Any CSS color. */
  strokeColor?: string;
  /** Accessible description of the drawing. */
  label: string;
}

export const LSystemTracingRenderer: FunctionComponent<LSystemTracingRendererProps> = ({
  trace,
  scale = 1.0,
  strokeWidth = 0.0075,
  strokeColor = "var(--color-orange)",
  label,
}) => {
  // Rendered declaratively (rather than in an effect), so that the drawing is part of the server-rendered HTML.
  const { width, height, viewBox, pathData } = useMemo(() => {
    const width = round(trace.width * scale);
    const height = round(trace.height * scale);
    // room for the stroke (and its round caps) around the outermost segments, which would be clipped otherwise
    const padding = round(strokeWidth / 2);
    return {
      width,
      height,
      viewBox: [-padding, -padding, width + 2 * padding, height + 2 * padding].map(round).join(" "),
      pathData: trace.positions
        .map(({ x, y }, i) => `${i === 0 ? "M" : "L"}${round(x * scale)},${round(y * scale)}`)
        .join(""),
    };
  }, [trace, scale, strokeWidth]);

  // On-screen size of the drawing, to keep its stroke visible however much it is scaled down.
  const svgRef = useRef<SVGSVGElement>(null);
  const [renderedSize, setRenderedSize] = useState<{ width: number; height: number } | null>(null);
  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) {
      return;
    }
    const observer = new ResizeObserver(([{ contentRect }]) =>
      setRenderedSize({ width: contentRect.width, height: contentRect.height }),
    );
    observer.observe(svg);
    return () => observer.disconnect();
  }, []);
  const minStrokeWidth = useMemo(() => {
    if (!renderedSize?.width || !renderedSize.height || !width) {
      return 0;
    }
    // the drawing is fitted (and centered) within the SVG box: the most constrained dimension sets its scale
    const pixelsPerUnit = Math.min(renderedSize.width / width, height ? renderedSize.height / height : Infinity);
    return MIN_STROKE_WIDTH_PX / pixelsPerUnit;
  }, [renderedSize, width, height]);

  return (
    <svg ref={svgRef} role="img" aria-label={label} viewBox={viewBox} className="h-auto max-h-[75vh] w-full">
      <path
        d={pathData}
        fill="none"
        style={{ stroke: strokeColor }}
        strokeWidth={Math.max(strokeWidth, minStrokeWidth)}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
