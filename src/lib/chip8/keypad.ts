/**
 * Stores the state of the virtual keypad used for input.
 *
 * The Chip8 virtual keypad has the following layout :
 *
 * ```
 * Virtual Keypad       Keyboard (QWERTY)
 * +-+-+-+-+                +-+-+-+-+
 * |1|2|3|C|                |1|2|3|4|
 * +-+-+-+-+                +-+-+-+-+
 * |4|5|6|D|                |Q|W|E|R|
 * +-+-+-+-+       =>       +-+-+-+-+
 * |7|8|9|E|                |A|S|D|F|
 * +-+-+-+-+                +-+-+-+-+
 * |A|0|B|F|                |Z|X|C|V|
 * +-+-+-+-+                +-+-+-+-+
 * ```
 *
 * @see http://www.multigesture.net/articles/how-to-write-an-emulator-chip-8-interpreter/
 */
export class Chip8Keypad {
  pressedKeys: boolean[] = [];

  constructor() {
    this.pressedKeys = [];
    for (let i = 0x0; i <= 0xf; i++) {
      this.pressedKeys.push(false);
    }
  }

  isKeyPressed(nibbleIndex: number): boolean {
    return this.pressedKeys[nibbleIndex];
  }

  setIsKeyPressed(nibbleIndex: number, isPressed: boolean) {
    this.pressedKeys[nibbleIndex] = isPressed;
  }
}
