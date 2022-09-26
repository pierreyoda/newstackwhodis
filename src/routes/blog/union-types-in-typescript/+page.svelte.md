# Union Types in Typescript

## Introduction

The more I work with Typescript, the more I find that it is most of all about _combining_ simple types together.

Two of the main ways of composing types are **union** and **intersection** types.

As described by the [Typescript Handbook](https://www.typescriptlang.org/docs/handbook/unions-and-intersections.html), ": a union type describes a value that can be one of several types".

## A Touch of Theory: Algebraic Types

In computer science, an **algebraic data type** (_ADT_) is a composite type, _i.e._ a type formed by composing other types.

## Typescript Unions

## Union String

```typescript
type ButtonColors = "red" | "green" | "blue";
```

### Runtime usage

But what happens when we need those values at **runtime**?

For instance, what if we need to _validate_ the button color above from an untrusted source (when serving an API for instance)?

Fortunately, Typescript 3.4 introduced [_const assertions_](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-4.html#const-assertions) which allows us to do the following:

```typescript
const BUTTON_COLORS = ["red", "green", "blue"] as const;
type ButtonColor = typeof BUTTON_COLORS[number];

// ...

const isButtonColor = (rawColor: string): rawColor is ButtonColor => BUTTON_COLORS.includes(rawColor);
```

We now have the best of both worlds with runtime-available values (as opposed to the naked union string above) _and_ strong type-safety (as opposed to Javascript enums).

### Types Mapping

We can combine Typescript's `Record` with union strings to build type-safe associations between keys and values:

For instance, to apply a Tailwind CSS class for any given `ButtonColor`:

```typescript
const buttonClasses: Record<ButtonColor, string> = {
  red: "bg-red",
  green: "bg-green",
  blue: "bg-blue",
}; // this will not build if a key is missing
```

### Types Discrimination

Union strings are also very useful when it comes to types discrimination.

Here's a simple example to explain the concept:

```typescript
type ApiResponse =
  | {
      type: "success";
      result: number;
    }
  | {
      type: "error";
      message: string;
    };

const response: ApiResponse = await fetchApi();
switch (response.type) {
  case "success":
    console.log(response.result);
    break;
  case "error":
    console.error(response.message);
    break;
} // this will not build if a case is missing
```

## Conclusion
