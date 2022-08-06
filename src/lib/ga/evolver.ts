import type { Individual } from "./genes";
import type { Optimize, SelectForBreeding, SelectForMutation } from "./mutators";

export interface GenerationStats {
  minimum: number;
  maximum: number;
  mean: number;
  standardDeviation: number;
}

const Optimizers: Record<string, Optimize> = {
  Maximize: (a, b) => a >= b,
  Minimize: (a, b) => a < b,
};

export interface GeneticEvolverConfig {
  poolSize: number;
  crossoverChance: number;
  mutationChance: number;
  iterations: number;
  forceSurvivalOfTheFittest: boolean;
  maxResults: number;
  optimizer: Optimize;
  selectForMutation: SelectForMutation;
  selectForBreeding: SelectForBreeding;
}

export interface GeneticEvolverFunctors<G> {
  /** Create a new, random individual. */
  seed: () => G;
  /** Evaluate the fitness (score) of a particular individual. */
  fitness: (gene: G) => number;
  /** Returns a randomly mutated individual. Must be immutable. */
  mutated: (gene: G) => G;
  /** Breed two individuals to create two children. */
  crossover: (mother: G, father: G) => [G, G];
}

export const buildGeneticEvolver = <G>(
  config: GeneticEvolverConfig, {
    seed,
    fitness,
    mutated,
    crossover,
  }: GeneticEvolverFunctors<G>,
) => {
  /** Choose the best between two scores. */
  const optimize = (scoreA: number, scoreB: number) => scoreA <= scoreB;

  const potentiallyMutate = (gene: G): G => Math.random() < config.mutationChance ? mutated(gene) : gene;

  /** Should we continue the evolution? Returns true if to be aborted. */
  const abortEvolution = (population: readonly Individual<G>[], generation: number, stats: GenerationStats) => false;

  return {
    start: () => {
      // initial pool population
      let pool = [...Array(config.poolSize).keys()].map(_ => seed());
      // iterate
      for (let n = 1; n <= config.iterations; n++) {
        // population
        const population = pool
          .map((gene): Individual<G> => ({ gene, fitness: fitness(gene) }))
          .sort((a, b) => optimize(a.fitness, b.fitness) ? -1 : 1);

        // statistics
        const mean = population.reduce(
          (sum, individual) => sum + individual.fitness,
          0,
        ) / population.length;
        const standardDeviation = Math.sqrt(population
          .map(individual => Math.pow(individual.fitness - mean, 2))
          .reduce((sum, v) => sum + v, 0) / population.length,
        );
        const stats: GenerationStats = {
          maximum: population[0].fitness,
          minimum: population[population.length - 1].fitness,
          mean,
          standardDeviation,
        };

        // premature termination
        const abort = abortEvolution(population, n, stats);
        if (abort || n === config.iterations - 1) {
          break;
        }

        // crossover and mutation
        const evolved = new Array(pool.length);
        if (config.forceSurvivalOfTheFittest) {
          evolved.push(population[0].gene);
        }
        while (evolved.length < config.poolSize) {
          if (evolved.length + 1 <= config.poolSize && // enough room for a crossover?
            Math.random() <= config.crossoverChance) { // elected for crossover?
            const parents = config.selectForBreeding(population, config.optimizer);
            const children = crossover(parents[0], parents[1]).map(gene => potentiallyMutate(gene));
            evolved.push(...children);
          } else {
            const selected = config.selectForMutation(population, config.optimizer);
            evolved.push(potentiallyMutate(selected));
          }
        }
        pool = evolved;
      }

      return pool;
    },
  };
};
