<script context="module" lang="ts">
  // import type { Load } from "@sveltejs/kit";

  // import { isDefined } from "../../utils";
  // import type { HostedROM } from "$lib/chip8/rom-fetcher";
  // import { hostedROMs, fetchHostedROM } from "$lib/chip8/rom-fetcher";

  // type LoadedROMsRegistry = Record<HostedROM, { data: Uint8Array }>;

  // export const load: Load = async ({ fetch, stuff }) => {
  //   const loadedROMs = (await Promise.all(hostedROMs.map(async (hostedROMName): Promise<[name: HostedROM, data: Uint8Array] | null> => {
  //     const data = await fetchHostedROM(fetch, hostedROMName);
  //     return data ? [hostedROMName, data] : null;
  //   }))).filter(isDefined);
  //   const loadedROMsRegistry = loadedROMs.reduce(
  //     (acc: LoadedROMsRegistry, [name, data]) => ({
  //       ...acc,
  //       [name]: { data },
  //     }),
  //     {} as any,
  //   );
  //   stuff.test = "hello";
  //   return {
  //     props: {
  //       loadedROMsRegistry,
  //     },
  //   };
  // }
</script>

<script lang="ts">
  import "../../styles/prism-shades-of-purple.css";
</script>

<div class="post-container">
  <slot />
</div>

<style lang="postcss">
  .post-container {
    @apply text-white;

    :global(> *) {
      @apply mt-4;
    }

    :global(a) {
      @apply text-lychee;
    }

    :global(h1) {
      @apply font-semibold text-2xl mb-10;
    }
    :global(h2) {
      @apply font-semibold text-xl mt-8 mb-8;
    }
    :global(h3) {
      @apply font-semibold mt-6 mb-6;
    }
  }
</style>
