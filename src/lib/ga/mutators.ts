import { randomIntegerInRange } from "../../utils";
import type { Individual } from "./genes";

export type Optimize = (a: number, b: number) => boolean;
export type SelectForMutation = <G>(population: readonly Individual<G>[], optimize: Optimize) => G;
export type SelectForBreeding = <G>(population: readonly Individual<G>[], optimize: Optimize) => [G, G];

export const MutationSelectors: {
  [name: string]: SelectForMutation;
} = {
  Tournament2: (population, optimize) => {
    const indexA = randomIntegerInRange(0, population.length - 1);
    const indexB = randomIntegerInRange(0, population.length - 1, [indexA]);
    const individualA = population[indexA];
    const individualB = population[indexB];
    return optimize(individualA.fitness, individualB.fitness)
      ? individualA.gene
      : individualB.gene;
  },
  Tournament3: (population, optimize) => {
    const indexA = randomIntegerInRange(0, population.length - 1);
    const indexB = randomIntegerInRange(0, population.length - 1, [indexA]);
    const indexC = randomIntegerInRange(0, population.length - 1, [indexA, indexB]);
    const individuals = [indexA, indexB, indexC].map(index => population[index]);
    const bestOfTwo = optimize(individuals[0].fitness, individuals[1].fitness)
      ? individuals[0]
      : individuals[1];
    return optimize(bestOfTwo.fitness, individuals[2].fitness)
      ? bestOfTwo.gene
      : individuals[2].gene;
  },
  Fittest: population => population[0].gene,
  Random: population => population[randomIntegerInRange(0, population.length - 1)].gene,
};
