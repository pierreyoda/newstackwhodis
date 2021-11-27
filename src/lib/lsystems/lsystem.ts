export type LSystemPosition = { x: number; y: number };

export interface LSystemTracingContext {
  pushPosition: () => void;
  popPosition: () => { position: LSystemPosition; angle: number };
  rotate: (angleInDegrees: number) => void;
}

export interface LSystemDescriptor<A extends string> {
  name: string;
  alphabet: readonly A[];
  axiom: string;
  rules: Record<A, LSystemAlphabetLetter>;
}

export interface LSystemAlphabetConstant {
  type: "constant";
  description: string;
  operation: (context: LSystemTracingContext) => void;
}

export interface LSystemAlphabetVariable {
  type: "variable";
  production: string;
}

export type LSystemAlphabetLetter = LSystemAlphabetConstant | LSystemAlphabetVariable;

export const lsystemAlgaeAlphabet = ["A", "B"] as const;
export type LSystemAlgaeAlphabet = typeof lsystemAlgaeAlphabet[number];
export const lsystemAlgaeDescriptor: LSystemDescriptor<LSystemAlgaeAlphabet> = {
  name: "Lindenmayer's Algae",
  alphabet: lsystemAlgaeAlphabet,
  axiom: "A",
  rules: {
    A: {
      type: "variable",
      production: "AB",
    },
    B: {
      type: "variable",
      production: "A",
    },
  },
};

export const lsystemSierpinskiTriangleAlphabet = ["F", "G", "+", "-"] as const;
export type LSystemSierpinskiTriangleAlphabet = typeof lsystemSierpinskiTriangleAlphabet[number];
export const lsystemSierpinskiTriangleDescriptorFactory = (
  angle: number,
): LSystemDescriptor<LSystemSierpinskiTriangleAlphabet> => ({
  name: "Sierpinski Triangle",
  alphabet: lsystemSierpinskiTriangleAlphabet,
  axiom: "F-G-G",
  rules: {
    "+": {
      type: "constant",
      description: "Turn counterclockwise by X°.",
      operation: ctx => ctx.rotate(angle),
    },
    "-": {
      type: "constant",
      description: "Turn clockwise by X°.",
      operation: ctx => ctx.rotate(-angle),
    },
    F: {
      type: "variable",
      production: "F-G+F+G-F",
    },
    G: {
      type: "variable",
      production: "GG",
    },
  },
});

export interface LSystem<A extends string> {
  descriptor: LSystemDescriptor<A>;
  generation: number;
  state: string;
}

export const createLSystem = <A extends string>(descriptor: LSystemDescriptor<A>): LSystem<A> => ({
  descriptor,
  generation: 0,
  state: descriptor.axiom,
});

const iteratedLSystem = <A extends string>(lsystem: Readonly<LSystem<A>>): string =>
  lsystem.state.split("").reduce((acc, letter) => {
    const rule = lsystem.descriptor.rules[letter as A];
    return rule?.type === "variable" ? `${acc}${rule.production}` : `${acc}${letter}`;
  }, "");

export const iterateLSystem = <A extends string>(lsystem: LSystem<A>) => {
  lsystem.state = iteratedLSystem(lsystem);
  ++lsystem.generation;
};

const PI_BY_180 = Math.PI / 180;
/**
 * Interpret an L-System state into a set of coordinates to draw, based on Logo turtle-like logic.
 *
 * @see https://www.wikiwand.com/en/Logo_(programming_language)
 */
export const traceLSystem = <A extends string>(
  lsystem: LSystem<A>,
): {
  width: number;
  height: number;
  forState: string;
  forGeneration: number;
  positions: LSystemPosition[];
} => {
  let currentAngle = 0; // in degrees
  const positions: LSystemPosition[] = [{ x: 0, y: 0 }];
  const stack: { position: LSystemPosition; angle: number }[] = [];
  let [minBoundary, maxBoundary]: LSystemPosition[] = [
    { x: 0, y: 0 },
    { x: 0, y: 0 },
  ];

  const tracingContext: LSystemTracingContext = {
    pushPosition: () => stack.push({ position: positions[positions.length - 1], angle: currentAngle }),
    popPosition: () => stack.pop(),
    rotate: angleInDegrees => {
      currentAngle = (currentAngle + angleInDegrees) % 360;
    },
  };

  const { state: forState } = lsystem;
  for (const letter of forState) {
    const rule = lsystem.descriptor.rules[letter as A];
    if (!rule) {
      continue;
    }
    if (rule.type === "constant") {
      rule.operation(tracingContext);
    } else {
      const lastPosition = positions[positions.length - 1];
      const nextPosition: LSystemPosition = {
        x: lastPosition.x + Math.cos(currentAngle * PI_BY_180),
        y: lastPosition.y + Math.sin(currentAngle * PI_BY_180),
      };
      positions.push(nextPosition);

      minBoundary = {
        x: Math.min(minBoundary.x, nextPosition.x),
        y: Math.min(minBoundary.y, nextPosition.y),
      };
      maxBoundary = {
        x: Math.max(maxBoundary.x, nextPosition.x),
        y: Math.max(maxBoundary.y, nextPosition.y),
      };
    }
  }

  return {
    forState,
    forGeneration: lsystem.generation,
    // center the final drawing by zeroing out each position
    // taken from https://github.com/alipman88/l-systems
    positions: positions.map(({ x, y }) => ({
      x: parseFloat((x - minBoundary.x).toFixed(1)),
      y: parseFloat((maxBoundary.y - y).toFixed(1)), // flip vertically
    })),
    width: maxBoundary.x - minBoundary.x,
    height: maxBoundary.y - minBoundary.y,
  };
};

export type LSystemTrace = ReturnType<typeof traceLSystem>;
