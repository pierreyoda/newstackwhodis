import { FunctionComponent, ReactNode, useMemo, useState } from "react";

import { LSystemTracingRenderer } from "./LSystemTracingRenderer";
import { LSystem, LSystemTrace, iteratedLSystem, traceLSystem } from "@/content/lsystem/lsystem";
import { LSystemScaleSlider } from "./LSystemScaleSlider";
import clsx from "clsx";

/** Fixed locale, so that the server-rendered HTML is identical to the client-rendered one. */
const numberFormat = new Intl.NumberFormat("en-US");

const GenerationStepButton: FunctionComponent<{
  label: string;
  disabled: boolean;
  onClick: () => void;
  children: ReactNode;
}> = ({ label, disabled, onClick, children }) => (
  <button
    type="button"
    aria-label={label}
    disabled={disabled}
    onClick={onClick}
    className={clsx(
      "flex h-8 w-8 shrink-0 items-center justify-center rounded-md",
      "font-mono text-lg leading-none font-bold",
      "transition-opacity disabled:cursor-not-allowed disabled:opacity-40",
      "bg-space text-orange enabled:hover:text-light-orange",
    )}
  >
    {children}
  </button>
);

interface LSystemControllableTracingRendererProps {
  // L-System parameters
  lsystem: LSystem<string>;
  initialAngle?: number;
  initialGeneration?: number;
  // controls
  minGeneration?: number;
  maxGeneration?: number;
  // renderer controls
  scale?: number;
  strokeWidthScale: (generation: number) => number;
  /** Any CSS color, orange by default. */
  strokeColor?: string;
}

export const LSystemControllableTracingRenderer: FunctionComponent<LSystemControllableTracingRendererProps> = ({
  lsystem,
  initialAngle = 0,
  initialGeneration = 2,
  minGeneration = 0,
  maxGeneration = 6,
  scale = 1.0,
  strokeWidthScale,
  strokeColor,
}) => {
  const [forGeneration, setForGeneration] = useState(initialGeneration);
  const [statesPerGeneration, setStatesPerGeneration] = useState<Record<number, string>>({});

  const lsystemTrace = useMemo((): LSystemTrace => {
    let currentLSystem = { ...lsystem };
    const currentStatesPerGeneration: Record<number, string> = { ...statesPerGeneration };
    for (let currentGeneration = 0; currentGeneration <= forGeneration; currentGeneration++) {
      if (!statesPerGeneration[currentGeneration]) {
        currentStatesPerGeneration[currentGeneration] = iteratedLSystem(currentLSystem);
      }
      currentLSystem.generation = currentGeneration;
      currentLSystem.state = currentStatesPerGeneration[currentGeneration];
    }
    setStatesPerGeneration(currentStatesPerGeneration);
    return traceLSystem(currentLSystem, initialAngle);
  }, [lsystem, forGeneration, initialAngle]);

  const strokeWidth = useMemo(() => strokeWidthScale(forGeneration), [strokeWidthScale, forGeneration]);

  // the turtle draws one segment per variable
  const segmentsCount = useMemo(() => {
    let count = 0;
    for (const letter of lsystemTrace.forState) {
      if (lsystem.descriptor.rules[letter]?.type === "variable") {
        ++count;
      }
    }
    return count;
  }, [lsystemTrace.forState, lsystem.descriptor.rules]);

  const stepGeneration = (delta: number) =>
    setForGeneration(generation => Math.min(maxGeneration, Math.max(minGeneration, generation + delta)));

  return (
    <div className="border-gray rounded-lg border bg-black">
      <div className="flex flex-col gap-3 p-4 md:px-5">
        <div className="flex items-baseline justify-between gap-4">
          <span className="flex items-baseline gap-2">
            <span className="text-gray-lighter text-xs font-semibold tracking-wider uppercase">Generation</span>
            <span className="font-semibold text-white tabular-nums">{lsystemTrace.forGeneration}</span>
            <span className="text-gray-lighter text-sm tabular-nums">/ {maxGeneration}</span>
          </span>
          <span className="text-gray-lighter text-xs tabular-nums">
            {numberFormat.format(segmentsCount)} segment{segmentsCount === 1 ? "" : "s"}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <GenerationStepButton
            label="Previous generation"
            disabled={forGeneration <= minGeneration}
            onClick={() => stepGeneration(-1)}
          >
            −
          </GenerationStepButton>
          <LSystemScaleSlider
            initialValue={forGeneration}
            value={forGeneration}
            onChange={setForGeneration}
            min={minGeneration}
            max={maxGeneration}
            ariaLabel="Generation"
          />
          <GenerationStepButton
            label="Next generation"
            disabled={forGeneration >= maxGeneration}
            onClick={() => stepGeneration(1)}
          >
            +
          </GenerationStepButton>
        </div>
      </div>
      <div className="border-gray border-t p-4 md:p-6">
        <LSystemTracingRenderer
          trace={lsystemTrace}
          scale={scale}
          strokeWidth={strokeWidth}
          strokeColor={strokeColor}
          label={`${lsystem.descriptor.name}, generation ${lsystemTrace.forGeneration}`}
        />
      </div>
    </div>
  );
};
