<script lang="ts">
  import type { LSystemAlphabetConstant, LSystemAlphabetVariable, LSystemDescriptor } from "./lsystem";

  export let descriptor: LSystemDescriptor<string>;

  $: constants = Object.entries(descriptor.rules).filter(([_, { type }]) => type === "constant") as [
    string,
    LSystemAlphabetConstant,
  ][];
  $: variables = Object.entries(descriptor.rules).filter(([_, { type }]) => type === "variable") as [
    string,
    LSystemAlphabetVariable,
  ][];
</script>

<div class="container">
  <p class="name">{descriptor.name}</p>
  <p class="axiom">Axiom: {descriptor.axiom}</p>
  <div class="section">
    <p>Constants:</p>
    <ul>
      {#each constants as constant}
        <li>{constant[0]}: {constant[1].description}</li>
      {/each}
    </ul>
  </div>
  <div class="section">
    <p>Variables:</p>
    <ul>
      {#each variables as variable}
        <li>{variable[0]} => {variable[1].production}</li>
      {/each}
    </ul>
  </div>
</div>

<style lang="postcss">
  .container {
    @apply rounded p-3;
    @apply bg-white text-black-lighter;
    .name {
      @apply text-lg font-semibold;
      @apply border-b border-lychee mb-2;
    }
    .section {
      @apply mt-4;
      p {
        @apply mb-2;
      }
      ul > li {
        @apply mb-1;
      }
    }
  }
</style>
