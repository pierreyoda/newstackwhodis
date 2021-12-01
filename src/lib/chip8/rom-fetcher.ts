import type { LoadInput } from "@sveltejs/kit";

export const hostedROMs = ["MAZE"] as const;
export type HostedROM = typeof hostedROMs[number];

export const fetchHostedROM = async (fetch: LoadInput["fetch"], hostedROM: HostedROM): Promise<Uint8Array | null> => {
  const staticPath = `/chip8/ROMS/${hostedROM}`;
  try {
    const buffer = await fetch(staticPath, { method: "GET" }).then(res => res.arrayBuffer());
    return new Uint8Array(buffer);
  } catch (err) {
    console.error(`Chip8.fetchHostedROM("${hostedROM}") error:`, err);
    return null;
  }
};

// TODO: remove these hardcoded ROMs once I figure out how to work around SvelteKit's "1 context='module' per script only"
export const MAZE_ROM = new Uint8Array([
  162, 30, 194, 1, 50, 1, 162, 26, 208, 20, 112, 4, 48, 64, 18, 0, 96, 0, 113, 4, 49, 32, 18, 0, 18, 24, 128, 64, 32,
  16, 32, 64, 128, 16,
]);
