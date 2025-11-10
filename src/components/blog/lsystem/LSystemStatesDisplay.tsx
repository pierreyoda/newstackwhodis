import { FunctionComponent, useMemo } from "react";

interface LSystemStatesDisplayProps {
  states: readonly string[];
  limit?: number;
}

export const LSystemStatesDisplay: FunctionComponent<LSystemStatesDisplayProps> = ({ states, limit }) => {
  const limitedStates: readonly string[] = useMemo(() => states.slice(0, limit ?? states.length), [states, limit]);
  return (
    <ol>
      {limitedStates.map((state, i) => (
        <li key={i}>
          Generation {i} state: {state}
        </li>
      ))}
    </ol>
  );
};
