import {
  createLSystem,
  iteratedLSystem,
  lsystemAlgaeDescriptor,
  lsystemTreeDescriptorFactory,
  lsystemKochSnowflakeDescriptorFactory,
  lsystemSierpinskiTriangleDescriptorFactory,
} from "./lsystem";

// Algae
export const lsystemAlgaeMeta = (() => {
  const lsystemAlgae = createLSystem(lsystemAlgaeDescriptor);
  const lsystemAlgaeStates = [lsystemAlgae.descriptor.axiom];
  for (let i = 1; i <= 6; i++) {
    const newState = iteratedLSystem(lsystemAlgae);
    ++lsystemAlgae.generation;
    lsystemAlgae.state = newState;
    lsystemAlgaeStates.push(newState);
  }
  return {
    lsystemAlgae,
    lsystemAlgaeStates,
    lsystemAlgaeDescriptor,
  };
})();


// Sierpinski Triangle
export const lsystemSierpinski = createLSystem(lsystemSierpinskiTriangleDescriptorFactory(120));
// Koch's Snowflake
export const lsystemKochSnowflake = createLSystem(lsystemKochSnowflakeDescriptorFactory(60));
// "Tree"
export const lsystemTree = createLSystem(lsystemTreeDescriptorFactory(22.5));
