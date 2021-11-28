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
  {#if constants.length > 0}
    <div class="section">
      <p>Constants:</p>
      <ul>
        {#each constants as constant}
          <li><span class="letter">{constant[0]}</span>: {constant[1].description}</li>
        {/each}
      </ul>
    </div>
  {/if}
  <div class="section">
    <p>Variables:</p>
    <ul>
      {#each variables as variable}
        <li><span class="letter">{variable[0]}</span> => {variable[1].production}</li>
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
      @apply mt-2;
      p {
        @apply mb-2;
      }
      ul > li {
        @apply mb-1 text-sm;
        .letter {
          @apply text-space-blue font-semibold;
        }
      }
    }
  }
</style>
