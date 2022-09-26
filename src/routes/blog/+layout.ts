// import type { Load } from "@sveltejs/kit";

// import { isDefined } from "../../utils";
// import type { HostedROM } from "$lib/chip8/rom-fetcher";
// import { hostedROMs, fetchHostedROM } from "$lib/chip8/rom-fetcher";

// type LoadedROMsRegistry = Record<HostedROM, { data: Uint8Array }>;

// export const load: Load = async ({ fetch, stuff }) => {
//   const loadedROMs = (
//     await Promise.all(
//       hostedROMs.map(async (hostedROMName): Promise<[name: HostedROM, data: Uint8Array] | null> => {
//         const data = await fetchHostedROM(fetch, hostedROMName);
//         return data ? [hostedROMName, data] : null;
//       }),
//     )
//   ).filter(isDefined);
//   const loadedROMsRegistry = loadedROMs.reduce(
//     (acc: LoadedROMsRegistry, [name, data]) => ({
//       ...acc,
//       [name]: { data },
//     }),
//     {} as any,
//   );
//   console.log(loadedROMsRegistry);
//   return {
//     props: {
//       loadedROMsRegistry,
//     },
//   };
// };
