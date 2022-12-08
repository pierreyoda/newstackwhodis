export const isDefined = <T>(value: T | null | undefined): value is T => value !== null && value !== undefined;

/**
 * Returns a random integer in the given inclusive range.
 *
 * Optionally, exclude one or more numbers from being picked.
 */
export const randomIntegerInRange = (min: number, max: number, distinctFrom?: readonly number[]) => {
  let randomInteger: number;
  do {
    randomInteger = Math.floor(Math.random() * (max - min) + min);
  } while (!!distinctFrom && distinctFrom.includes(randomInteger));
  return randomInteger;
};
