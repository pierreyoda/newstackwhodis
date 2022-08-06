/**
 * A single individual in an evolution pool.
 */
export interface Individual<G> {
  gene: G;
  fitness: number;
}
