export const hostedROMs = [
  // Tetris
  "TETRIS",
  /// Demo: Maze, by David Winter, 199x
  "MAZE",
  /// Demo: Sierpinski, by Sergey Naydenov, 2010
  "SIERPINSKI",
  /// Test: Keypad, by Hap, 2006
  "KEYPAD",
] as const;
export type HostedROM = typeof hostedROMs[number];

export const fetchHostedROM = async (hostedROM: HostedROM): Promise<Uint8Array | null> => {
  const staticPath = `/chip8/ROMS/${hostedROM}`;
  try {
    const buffer = await fetch(staticPath, { method: "GET" }).then(res => res.arrayBuffer());
    return new Uint8Array(buffer);
  } catch (err) {
    console.error(`Chip8.fetchHostedROM("${hostedROM}") error:`, err);
    return null;
  }
};
