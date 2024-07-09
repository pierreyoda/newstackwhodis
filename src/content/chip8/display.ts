export const DISPLAY_WIDTH = 64;
export const DISPLAY_HEIGHT = 32;

export interface Chip8DisplayData {
  /**
   * 64x32 black and white screen.
   *
   * 'gfx[i]' contains the pixel column number 'i'.
   * For a single pixel, '1' means white and '0' black.
   *
   * Using bytes instead of booleans will make drawing instructions easier
   * to implement.
   */
  gfx: (0 | 1)[][];
  /**
   * Has the display been modified since the last time it was drawn ?
   *
   * Should be set to false by the emulator application after every draw.
   */
  isDirty: boolean;
}

const initChip8DisplayGfxData = (): Chip8DisplayData["gfx"] => {
  const gfx: (0 | 1)[][] = [];
  for (let y = 0; y < DISPLAY_HEIGHT; y++) {
    const column: (0 | 1)[] = [];
    for (let x = 0; x < DISPLAY_WIDTH; x++) {
      column.push(0);
    }
    gfx.push(column);
  }
  return gfx;
};

const initChip8DisplayData = (): Chip8DisplayData => ({
  gfx: initChip8DisplayGfxData(),
  isDirty: true,
});

/**
 * The graphics component of a Chip 8 virtual machine.
 * The Chip 8 uses a 64x32 monochrome display with the format:
 *
 * ```
 * O-----------------> X
 * |(0,0)      (63,0)|
 * |                 |
 * |(0,31)    (63,31)|
 * ∨-----------------.
 * Y
 * ```
 */
export class Chip8Display {
  data = initChip8DisplayData();

  clear() {
    this.data.gfx = initChip8DisplayGfxData();
    this.data.isDirty = true;
  }

  /**
   * Draw the given sprite to the display at the given position.
   *
   * The sprite is a reference to the slice of an array of 8 * H pixels.
   * Return true if there was a collision (i.e. if any of the written pixels
   * changed from 1 to 0).
   */
  draw(positionX: number, positionY: number, sprite: readonly number[]): boolean {
    const h = sprite.length;
    let collision = false;
    for (let j = 0; j < h; j++) {
      for (let i = 0; i < 8; i++) {
        // screen wrap if necessary
        const [y, x] = [(positionY + j) % DISPLAY_HEIGHT, (positionX + i) % DISPLAY_WIDTH];

        // draw each sprite pixel with a XOR operation, i.e. toggle the pixel
        // 0x80 = 1000_0000 : allows to check each pixel in the sprite
        if ((sprite[j] & (0x80 >> i)) !== 0x00) {
          if (this.data.gfx[y][x] == 0x01) {
            collision = true;
          }
          this.data.gfx[y][x] ^= 0x01;
        }
      }
    }
    this.data.isDirty = true;
    return collision;
  }
}

/**
 * Chip8 font set.
 *
 * Each number or character is 4x5 pixels and is stored as 5 bytes.
 * In each byte, only the first nibble (the first 4 bytes) is used.
 *
 * For instance, with the number 3:
 *
 * ```
 * hex     bin      => drawn pixels
 * 0xF0  1111 0000        ****
 * 0X10  0001 0000           *
 * 0xF0  1111 0000        ****
 * 0x10  0001 0000           *
 * 0xF0  1111 0000        ****
 * ```
 */
export const FONT_SET: readonly number[] = [
  0xf0,
  0x90,
  0x90,
  0x90,
  0xf0, // 0
  0x20,
  0x60,
  0x20,
  0x20,
  0x70, // 1
  0xf0,
  0x10,
  0xf0,
  0x80,
  0xf0, // 2
  0xf0,
  0x10,
  0xf0,
  0x10,
  0xf0, // 3
  0x90,
  0x90,
  0xf0,
  0x10,
  0x10, // 4
  0xf0,
  0x80,
  0xf0,
  0x10,
  0xf0, // 5
  0xf0,
  0x80,
  0xf0,
  0x90,
  0xf0, // 6
  0xf0,
  0x10,
  0x20,
  0x40,
  0x40, // 7
  0xf0,
  0x90,
  0xf0,
  0x90,
  0xf0, // 8
  0xf0,
  0x90,
  0xf0,
  0x10,
  0xf0, // 9
  0xf0,
  0x90,
  0xf0,
  0x90,
  0x90, // A
  0xe0,
  0x90,
  0xe0,
  0x90,
  0xe0, // B
  0xf0,
  0x80,
  0x80,
  0x80,
  0xf0, // C
  0xe0,
  0x90,
  0x90,
  0x90,
  0xe0, // D
  0xf0,
  0x80,
  0xf0,
  0x80,
  0xf0, // E
  0xf0,
  0x80,
  0xf0,
  0x80,
  0x80, // F
];
