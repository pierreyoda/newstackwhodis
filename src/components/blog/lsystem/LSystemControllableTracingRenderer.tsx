import dynamic from "next/dynamic";
import { FunctionComponent, useMemo, useState } from "react";

import { LSystemTracingRenderer } from "./LSystemTracingRenderer";
import { LSystem, LSystemTrace, iteratedLSystem, traceLSystem } from "@/content/lsystem/lsystem";

interface ReactSingleSliderProps {
  start: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step: number;
}

const Slider = dynamic<ReactSingleSliderProps>({
  ssr: false,
  loader: () => import("react-slider-kit"),
});

interface LSystemControllableTracingRendererProps {
  lsystem: LSystem<string>;
  initialAngle: number;
  initialGeneration: number;
  // controls
  minGeneration: number;
  maxGeneration: number;
  // renderer controls
  scale: number;
  strokeWidthScale: (generation: number) => number;
  strokeColor: string;
}

export const LSystemControllableTracingRenderer: FunctionComponent<LSystemControllableTracingRendererProps> = ({
  lsystem,
  initialAngle = 0,
  initialGeneration = 2,
  minGeneration = 0,
  maxGeneration = 6,
  scale = 1.0,
  strokeWidthScale,
  strokeColor = "#141416",
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

  return (
    <div>
      <div>
        <span className="mb-2">Generation:&nbsp;</span>
        <Slider
          start={forGeneration}
          onChange={setForGeneration}
          min={minGeneration}
          max={maxGeneration}
          step={Math.round(maxGeneration / (minGeneration + 1))}
        />
      </div>
      <div className="mt-6">
        <LSystemTracingRenderer
          trace={lsystemTrace}
          scale={scale}
          strokeWidth={strokeWidth}
          strokeColor={strokeColor}
          showGenerationLabel={false}
        />
      </div>
    </div>
  );
};
