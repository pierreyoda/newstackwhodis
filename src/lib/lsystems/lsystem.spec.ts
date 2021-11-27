import {
  createLSystem,
  iterateLSystem,
  lsystemAlgaeDescriptor,
  lsystemSierpinskiTriangleDescriptorFactory,
  traceLSystem,
} from "./lsystem";

describe("L-System implementation", () => {
  it("should correctly evolve a basic L-System", () => {
    const lsystem = createLSystem(lsystemAlgaeDescriptor);
    expect(lsystem.generation).toEqual(0);
    expect(lsystem.state).toEqual("A");
    iterateLSystem(lsystem);
    expect(lsystem.generation).toEqual(1);
    expect(lsystem.state).toEqual("AB");
    iterateLSystem(lsystem);
    expect(lsystem.generation).toEqual(2);
    expect(lsystem.state).toEqual("ABA");
    iterateLSystem(lsystem);
    expect(lsystem.generation).toEqual(3);
    expect(lsystem.state).toEqual("ABAAB");
    iterateLSystem(lsystem);
    expect(lsystem.generation).toEqual(4);
    expect(lsystem.state).toEqual("ABAABABA");
  });

  it("should correctly trace a basic L-System", () => {
    const lsystem = createLSystem(lsystemSierpinskiTriangleDescriptorFactory(120));
    iterateLSystem(lsystem);
    expect(lsystem.generation).toEqual(1);
    expect(lsystem.state).toEqual("F−G+F+G−F−GG−GG");

    const { width, height } = traceLSystem(lsystem);
    expect(width).toBeCloseTo(3.5);
    expect(height).toBeCloseTo(5.2);
  });
});
