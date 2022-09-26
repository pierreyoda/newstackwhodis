---
title: "Cracking the Advent of Code 2021"
description: "Making an interactive solver to all of the Advent of Code 2021's challenges with Typescript and Svelte(Kit)."
date: "2022-01-10"
published: true
---

# Cracking the Advent of Code 2021

## Introduction

## The Stack

For each problem, the associated "metadata" (challenge description, inputs, _etc._) and the corresponding solution for each sub-part is written in raw Typescript.

The website itself is written in SvelteKit and Typescript, just like this blog - minus the [MDsveX](https://github.com/pngwn/MDsveX) stuff.

You can checkout the entire source code on [GitHub](https://github.com/pierreyoda/advent-2021-svelte).

## Modeling a challenge

Here is how a daily challenge is represented in Typescript:

```typescript
export interface AdventOfCodeDay<Section = AdventOfCodeDaySection> {
  dayNumber: number;
  title: string;
  sections: readonly Section[];
}
```

You can see that `Section` is parametrized in order to differentiate between section metadata and the full-blown section data.

A section is then defined as follows:

```typescript
export interface AdventOfCodeDaySection<
  Type extends AdventOfCodeDayComputeFunctionType = AdventOfCodeDayComputeFunctionType,
> {
  inputs: string;
  /** In **raw** markdown. */
  description: string;
  computeFunction: AdventOfCodeDayComputeFunction<Type>;
  expectedAnswer: AdventOfCodeDayComputeFunctionOutput;
  processInputs?: (rawInputs: string) => AdventOfCodeDayComputeFunctionInputs<Type>;
}
```

We parametrize over the input data's type since it will change the type of the computing function and, if any, of the function pre-processing the inputs.

Finally, here is how we define a solving function:

```typescript
export type AdventOfCodeDayComputeFunction<
  Type extends AdventOfCodeDayComputeFunctionType = AdventOfCodeDayComputeFunctionType,
> = {
  type: Type;
  compute: (inputs: AdventOfCodeDayComputeFunctionInputs<Type>) => AdventOfCodeDayComputeFunctionOutput;
};
```

Like many "low-level" Typescript definitions - for instance, have you ever looked at React's definitions? -, this may seem over-complicated at first but it will pay off in the actual usage.

## Solving a challenge

Let's take the first day's challenge as an example:

```typescript

```
