import { Chip8VirtualMachine } from "./vm";

// NB: these tests are directly lifted from my older rust-chip8 project:
// https://github.com/pierreyoda/rust-chip8
describe("Chip8 Virtual Machine", () => {
  it("should correctly jump to a given address", () => {
    const vm = new Chip8VirtualMachine();
    vm.executeOpcode(0x1793);
    expect(vm.data.pc).toEqual(0x0793);
  });

  it("should correctly handle subroutines", () => {
    const vm = new Chip8VirtualMachine();
    vm.executeOpcode(0x2bbb);
    expect(vm.data.pc).toEqual(0x0bbb);
    expect(vm.data.stack[0]).toEqual(0x200);
    vm.executeOpcode(0x00ee);
    expect(vm.data.pc).toEqual(0x200 + 2);

    vm.reset();
    expect(vm.data.stack[0]).toEqual(0);
    vm.data.stack[0] = 0x0aaa;
    vm.data.stack[1] = 0x0bbb;
    vm.data.sp = 0x2;
    vm.executeOpcode(0x00ee);
    expect(vm.data.sp).toEqual(1);
    expect(vm.data.pc).toEqual(vm.data.stack[1] + 2);
  });

  it("should correctly handle registers and timers loading", () => {
    const vm = new Chip8VirtualMachine();
    vm.executeOpcode(0x1200);

    vm.executeOpcode(0x6abc); // ld_vx_nn
    expect(vm.data.registers[0xa]).toEqual(0xbc);
    vm.executeOpcode(0x8ba0); // ld_vx_vy
    vm.executeOpcode(0xa789); // ld_i_addr
    expect(vm.data.i).toEqual(0x789);

    vm.executeOpcode(0xfb15); // ld_dt_vx
    vm.executeOpcode(0xf007); // ld_vx_dt
    expect(vm.data.registers[0x0]).toEqual(0xbc);
    vm.executeOpcode(0xfa18); // ld_st_vx
    expect(vm.data.ST).toEqual(0xbc);

    expect(vm.data.pc).toEqual(0x200 + 2 * 6);
  });

  it("should correctly handle loading memory from and into registers", () => {
    const vm = new Chip8VirtualMachine();
    vm.executeOpcode(0x1321);

    vm.executeOpcode(0x6011);
    vm.executeOpcode(0x6122);
    vm.executeOpcode(0x6233);
    vm.executeOpcode(0x6321);
    vm.executeOpcode(0xa500);
    expect(vm.data.i).toEqual(0x500);
    vm.executeOpcode(0xf355); // ld_mem_i_regs
    expect(vm.data.memory[0x500 + 0]).toEqual(0x11);
    expect(vm.data.memory[0x500 + 1]).toEqual(0x22);
    expect(vm.data.memory[0x500 + 2]).toEqual(0x33);
    expect(vm.data.memory[0x500 + 3]).toEqual(0x21);
    expect(vm.data.i).toEqual(0x500 + 4);
    expect(vm.data.pc).toEqual(0x321 + 2 * 6);

    vm.data.memory[0x500 + 0] = 0x12;
    vm.data.memory[0x500 + 1] = 0x24;
    vm.data.memory[0x500 + 2] = 0x56;
    vm.executeOpcode(0xa500);
    expect(vm.data.i).toEqual(0x500);
    vm.executeOpcode(0xf365); // ld_regs_mem_i
    expect(vm.data.registers[0x0]).toEqual(0x12);
    expect(vm.data.registers[0x1]).toEqual(0x24);
    expect(vm.data.registers[0x2]).toEqual(0x56);
    expect(vm.data.registers[0x3]).toEqual(0x21);
    expect(vm.data.i).toEqual(0x500); // I should not be changed

    expect(vm.data.pc).toEqual(0x0321 + 2 * 8);
  });

  it("should correctly handle branching", () => {
    const vm = new Chip8VirtualMachine();
    vm.executeOpcode(0x1250); // pc = 0x250
    vm.executeOpcode(0x6a18); // VA = 0x18
    expect(vm.data.registers[10]).toEqual(0x18);
    vm.executeOpcode(0x3a18); // se_vx_nn
    vm.executeOpcode(0x3a19); // se_vx_nn
    vm.executeOpcode(0x4a18); // sne_vx_nn
    vm.executeOpcode(0x4a19); // sne_vx_nn
    expect(vm.data.pc).toEqual(0x0250 + 2 + 4 + 2 + 2 + 4);
    vm.executeOpcode(0x1300); // pc = 0x300
    vm.executeOpcode(0x6b18); // VB = 0x18
    vm.executeOpcode(0x5ab0); // se_vx_vy
    vm.executeOpcode(0x5ac0); // se_vx_vy
    vm.executeOpcode(0x9af0); // sne_vx_vy
    expect(vm.data.pc).toEqual(0x0300 + 2 + 4 + 2 + 4);
  });

  it("should correctly handle the add operation", () => {
    const vm = new Chip8VirtualMachine();
    vm.executeOpcode(0x1faf);
    vm.executeOpcode(0x6803);
    vm.executeOpcode(0x78ff); // add_vx_nn
    expect(vm.data.registers[8]).toEqual((0x03 + 0xff) % 256);
    vm.executeOpcode(0x6eaf);
    vm.executeOpcode(0x6dff);
    vm.executeOpcode(0x8ed4); // add_vx_vy
    expect(vm.data.registers[0xf]).toEqual(0x1);
    expect(vm.data.registers[14]).toEqual((0xaf + 0xff) % 256);
    vm.executeOpcode(0x6013);
    vm.executeOpcode(0x6114);
    vm.executeOpcode(0x8014);
    expect(vm.data.registers[0xf]).toEqual(0x0);
    expect(vm.data.registers[0]).toEqual(0x13 + 0x14);
    vm.executeOpcode(0xa999); // I = 0x999
    vm.executeOpcode(0xfd1e); // add_i_vx
    expect(vm.data.i).toEqual(0xff + 0x999);
    expect(vm.data.pc).toEqual(0xfaf + 2 * 10);
  });

  it("should correctly handle the subtraction operation", () => {
    const vm = new Chip8VirtualMachine();
    vm.executeOpcode(0x1444);
    vm.executeOpcode(0x6009);
    vm.executeOpcode(0x610f);
    vm.executeOpcode(0x8015); // sub_vx_vy
    expect(vm.data.registers[0xf]).toEqual(0x1);
    expect(vm.data.registers[0]).toEqual(0xfa);
    vm.executeOpcode(0x6009);
    vm.executeOpcode(0x8017); // subn_vx_vy
    expect(vm.data.registers[0xf]).toEqual(0x0);
    expect(vm.data.registers[0]).toEqual(0x6);
    expect(vm.data.pc).toEqual(0x444 + 2 * 5);
  });

  it("should correctly handle the or operation", () => {
    const vm = new Chip8VirtualMachine();
    vm.executeOpcode(0x1234);
    vm.executeOpcode(0x6429);
    vm.executeOpcode(0x6530);
    vm.executeOpcode(0x8451); // or_vx_vy
    expect(vm.data.pc).toEqual(0x234 + 2 * 3);
    expect(vm.data.registers[4]).toEqual(0x39);
  });

  it("should correctly handle the and operation", () => {
    const vm = new Chip8VirtualMachine();
    vm.executeOpcode(0x1456);
    vm.executeOpcode(0x6acf);
    vm.executeOpcode(0x606a);
    vm.executeOpcode(0x80a2); // and_vx_vy
    expect(vm.data.pc).toEqual(0x456 + 2 * 3);
    expect(vm.data.registers[0]).toEqual(0x4a);
  });

  it("should correctly handle the xor operation", () => {
    const vm = new Chip8VirtualMachine();
    vm.executeOpcode(0x1789);
    vm.executeOpcode(0x6142);
    vm.executeOpcode(0x627d);
    vm.executeOpcode(0x8123); // xor_vx_vy
    expect(vm.data.pc).toEqual(0x789 + 2 * 3);
    expect(vm.data.registers[1]).toEqual(0x3f);
  });

  it("should correctly handle the shift operation", () => {
    const vm = new Chip8VirtualMachine();
    vm.executeOpcode(0x1900);
    vm.executeOpcode(0x6006);
    vm.executeOpcode(0x610f);

    vm.setShouldShiftOpcodeUseVY(false); // do not shift on VY
    vm.executeOpcode(0x8016); // shr_vy_vy
    expect(vm.data.registers[0]).toEqual(0x06 >> 1);
    expect(vm.data.registers[0xf]).toEqual(0x06 & 0x01); // LSB
    vm.executeOpcode(0x8016);
    vm.executeOpcode(0x801e); // shl_vx_vy
    expect(vm.data.registers[0]).toEqual((0x06 >> 2) << 1);
    expect(vm.data.registers[0xf]).toEqual((0x06 >> 2) & 0x80); // MSB

    vm.executeOpcode(0x6006);
    vm.setShouldShiftOpcodeUseVY(true); // shift on VY
    vm.executeOpcode(0x8016);
    expect(vm.data.registers[0]).toEqual(0x0f >> 1);
    expect(vm.data.registers[0xf]).toEqual(0x0f & 0x01);
    vm.executeOpcode(0x8116);
    vm.executeOpcode(0x801e);
    expect(vm.data.registers[0]).toEqual((0x0f >> 1) << 1);
    expect(vm.data.registers[0xf]).toEqual((0x0f >> 1) & 0x80);
  });

  it("should correctly handle the BCD operation", () => {
    const vm = new Chip8VirtualMachine();
    vm.executeOpcode(0x1515);
    vm.executeOpcode(0x6095); // 149
    vm.executeOpcode(0xa400);
    vm.executeOpcode(0xf033); // ld_mem_i_bcd_vx
    expect(vm.data.memory[0x400 + 0]).toEqual(0b0001);
    expect(vm.data.memory[0x400 + 1]).toEqual(0b0100);
    expect(vm.data.memory[0x400 + 2]).toEqual(0b1001);
    expect(vm.data.pc).toEqual(0x515 + 2 * 3);
  });

  it("should correctly handle input", () => {
    const vm = new Chip8VirtualMachine();
    vm.executeOpcode(0x1999);
    vm.executeOpcode(0x6d0f);
    vm.executeOpcode(0x610e);
    vm.keypad.setIsKeyPressed(0xf, true);
    vm.keypad.setIsKeyPressed(0xe, false);
    vm.executeOpcode(0xed9e); // skp_vx
    expect(vm.data.pc).toEqual(0x999 + 4 + 4);
    vm.executeOpcode(0xe1a1); // sknp_vx
    vm.executeOpcode(0xe19e);
    expect(vm.data.pc).toEqual(0x999 + 4 + 4 + 6);
  });

  it("should correctly handle drawing", () => {
    const vm = new Chip8VirtualMachine();
    vm.executeOpcode(0x1200);
    vm.executeOpcode(0xa250);
    vm.data.memory[0x250 + 0] = 0b1110_0111;
    vm.data.memory[0x250 + 1] = 0b0110_0110;
    vm.data.memory[0x250 + 2] = 0b0011_1100;

    vm.executeOpcode(0x6a19); // x = 25
    vm.executeOpcode(0x6b07); // y =  7
    vm.executeOpcode(0xdab3);
    expect(vm.display.data.isDirty).toEqual(true);
    expect(vm.data.registers[0xf]).toEqual(0x0);
    const a0 = [1, 1, 1, 0, 0, 1, 1, 1];
    const a1 = [0, 1, 1, 0, 0, 1, 1, 0];
    const a2 = [0, 0, 1, 1, 1, 1, 0, 0];
    for (let i = 0; i < 8; i++) {
      expect(vm.display.data.gfx[7 + 0][25 + i]).toEqual(a0[i]);
      expect(vm.display.data.gfx[7 + 1][25 + i]).toEqual(a1[i]);
      expect(vm.display.data.gfx[7 + 2][25 + i]).toEqual(a2[i]);
    }

    vm.display.data.isDirty = false;
    vm.executeOpcode(0xa251);
    vm.executeOpcode(0xdab1);
    expect(vm.display.data.isDirty).toEqual(true);
    expect(vm.data.registers[0xf]).toEqual(0x1);
    const a0_bis = [1, 0, 0, 0, 0, 0, 0, 1];
    for (let i = 0; i < 8; i++) {
      expect(vm.display.data.gfx[7 + 0][25 + i]).toEqual(a0_bis[i]);
      expect(vm.display.data.gfx[7 + 1][25 + i]).toEqual(a1[i]);
      expect(vm.display.data.gfx[7 + 2][25 + i]).toEqual(a2[i]);
    }

    expect(vm.data.pc).toEqual(0x200 + 2 * 6);
  });
});
