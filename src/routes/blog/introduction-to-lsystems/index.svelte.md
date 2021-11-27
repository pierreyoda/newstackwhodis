<script lang="ts">
  import {
    createLSystem,
    lsystemAlgaeDescriptor,
    lsystemTreeDescriptorFactory,
    lsystemSierpinskiTriangleDescriptorFactory,
  } from "$lib/lsystems/lsystem";
  import LSystemDescriptorWidget from "$lib/lsystems/LSystemDescriptorWidget.svelte";
  import LSystemTracingRenderer from "$lib/lsystems/LSystemTracingRenderer.svelte";
  import LSystemControllableTracingRenderer from "$lib/lsystems/LSystemControllableTracingRenderer.svelte";

  // Sierpinski Triangle
  const lsystemSierpinski = createLSystem(lsystemSierpinskiTriangleDescriptorFactory(120));

  // "Tree"
  const lsystemTree = createLSystem(lsystemTreeDescriptorFactory(22.5));
</script>

# Introduction to L-Systems

A [Lindenmayer system](https://www.wikiwand.com/en/L-system) is "a parallel rewriting system and a type of formal grammar". Theorized by Aristid Lindenmayer in 1968, they are a way of modelling the growth of an **organism** or generating **fractals**.

## Definition of an L-System

An L-System is composed of an alphabet, some constants, an axiom describing the initial state and evolution rules for each variable.

For instance, here is Lindenmayer's original L-System modelling the growth of an algae:

<LSystemDescriptorWidget descriptor={lsystemAlgaeDescriptor} />

## Rendering

### Turtles all the way down

TODO:

This is done internally by the `traceLSystem` function, which outputs coordinates then rendered with **d3.js** in a purpose-made component.

### Sierpinski's Triangle

This is a slightly more evolved L-System than our algae. We now have constants, `+` and `-`, to angle the trajectory of our turtle:

<LSystemDescriptorWidget descriptor={lsystemSierpinski.descriptor} />

Let's see what this gives us after several iterations (you can control the current generation with the slider):

<LSystemControllableTracingRenderer
  lsystem={lsystemSierpinski}
  minGeneration={1}
  maxGeneration={8}
  strokeWidthScale={g => g / 50}
/>

## Applications

<LSystemDescriptorWidget descriptor={lsystemTree.descriptor} />

<LSystemControllableTracingRenderer
  lsystem={lsystemTree}
  minGeneration={2}
  maxGeneration={9}
  strokeWidthScale={() => 1.0}
  strokeColor="#689311"
/>

## Sources

- [The Algorithmic Beauty of Plants](http://algorithmicbotany.org/papers/#abop)
