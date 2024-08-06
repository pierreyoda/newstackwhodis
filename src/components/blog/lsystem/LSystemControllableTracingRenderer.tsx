import Slider from "rc-slider";
import { FunctionComponent, useMemo, useState } from "react";

import { LSystemTracingRenderer } from "./LSystemTracingRenderer";
import { LSystem, LSystemTrace, iteratedLSystem, traceLSystem } from "@/content/lsystem/lsystem";

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
  const lsystemTrace = useMemo(
    (): LSystemTrace => {
      let currentLSystem = { ...lsystem };
      const currentStatesPerGeneration: Record<number, string> = {};
      for (let currentGeneration = 0; currentGeneration <= forGeneration; currentGeneration++) {
        if (!statesPerGeneration[currentGeneration]) {
          currentStatesPerGeneration[currentGeneration] = iteratedLSystem(currentLSystem);
        }
        currentLSystem.generation = currentGeneration;
        currentLSystem.state = currentStatesPerGeneration[currentGeneration];
        setStatesPerGeneration(currentStatesPerGeneration);
      }
      return traceLSystem(currentLSystem, initialAngle);
    },
    [lsystem, initialAngle],
  );

  const strokeWidth = useMemo(
    () => strokeWidthScale(forGeneration),
    [strokeWidthScale, forGeneration],
  );

  return (
    <div>
      <div>
        <span>Generation:&nbsp;</span>
        <Slider
          tabIndex={0}
          value={forGeneration}
          onChange={v => setForGeneration(v as number)}
          min={minGeneration}
          max={maxGeneration}
          step={1}
          dots={true}
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
