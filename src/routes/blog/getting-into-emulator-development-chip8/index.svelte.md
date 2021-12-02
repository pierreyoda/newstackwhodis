---
title: "Getting Into Emulator Development with the CHIP-8"
description: "Introduction to simple emulator development concepts and illustration with an in-browser virtual machine."
date: "2021-12-20"
published: true
---

<script lang="ts">
  import { MAZE_ROM, SIERPINSKI_ROM, KEYPAD_ROM } from "$lib/chip8/rom-fetcher";
  import Chip8Player from "$lib/chip8/Chip8Player.svelte";
</script>

# Getting Into Emulator Development with the CHIP-8

<Chip8Player dataROM={MAZE_ROM} scale={10} />

## Emulators

## Common Emulator Development Concepts

## The CHIP-8 Virtual Machine

## CHIP-8 in your browser

<Chip8Player dataROM={KEYPAD_ROM} scale={10} />
