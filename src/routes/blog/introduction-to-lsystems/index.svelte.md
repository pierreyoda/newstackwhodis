<script lang="ts">
  import {
    traceLSystem,
    createLSystem,
    iterateLSystem,
    lsystemAlgaeDescriptor,
    lsystemSierpinskiTriangleDescriptorFactory,
  } from "$lib/lsystems/lsystem";
  import LSystemDescriptorWidget from "$lib/lsystems/LSystemDescriptorWidget.svelte";
  import LSystemTracingRenderer from "$lib/lsystems/LSystemTracingRenderer.svelte";

  const lsystemSierpinski = createLSystem(lsystemSierpinskiTriangleDescriptorFactory(120));
  iterateLSystem(lsystemSierpinski);
  iterateLSystem(lsystemSierpinski);
  const lsystemSierpinskiTrace = traceLSystem(lsystemSierpinski);
</script>

# Introduction to L-Systems

A [Lindenmayer system](https://www.wikiwand.com/en/L-system) is "a parallel rewriting system and a type of formal grammar". Theorized by Aristid Lindenmayer in 1968, they are a way of modelling the growth of an **organism** or generating **fractals**.

## Definition of an L-System

An L-System is composed of an alphabet, some constants, an axiom describing the initial state and evolution rules for each variable.

For instance, here is Lindenmayer's original L-System modelling the growth of an algea:

<LSystemDescriptorWidget descriptor={lsystemAlgaeDescriptor} />

## Rendering

<LSystemTracingRenderer lsystem={lsystemSierpinski} trace={lsystemSierpinskiTrace} />
