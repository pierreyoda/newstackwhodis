<script lang="ts">
  import {
    traceLSystem,
    createLSystem,
    iterateLSystem,
    lsystemAlgaeDescriptor,
    lsystemTreeDescriptorFactory,
    lsystemSierpinskiTriangleDescriptorFactory,
  } from "$lib/lsystems/lsystem";
  import LSystemDescriptorWidget from "$lib/lsystems/LSystemDescriptorWidget.svelte";
  import LSystemTracingRenderer from "$lib/lsystems/LSystemTracingRenderer.svelte";

  // Sierpinski Triangle
  const lsystemSierpinski = createLSystem(lsystemSierpinskiTriangleDescriptorFactory(120));
  iterateLSystem(lsystemSierpinski);
  iterateLSystem(lsystemSierpinski);
  const lsystemSierpinskiTrace = traceLSystem(lsystemSierpinski);
  iterateLSystem(lsystemSierpinski);
  iterateLSystem(lsystemSierpinski);
  const lsystemSierpinskiTraceBis = traceLSystem(lsystemSierpinski);

  // "Tree"
  const lsystemTree = createLSystem(lsystemTreeDescriptorFactory(22.5));
  for (let i = 1; i <= 9; ++i) {
    iterateLSystem(lsystemTree);
  }
  const lsystemTreeTrace = traceLSystem(lsystemTree, 90);
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

Let's see what this gives us after two iterations:

<LSystemTracingRenderer trace={lsystemSierpinskiTrace} />

Then, after four iterations:

<LSystemTracingRenderer trace={lsystemSierpinskiTraceBis} />

## Applications

<LSystemDescriptorWidget descriptor={lsystemTree.descriptor} />

<LSystemTracingRenderer trace={lsystemTreeTrace} strokeWidth={1.0} strokeColor="#689311" />

## Sources

- [The Algorithmic Beauty of Plants](http://algorithmicbotany.org/papers/#abop)
