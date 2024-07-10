import {
  createLSystem,
  iteratedLSystem,
  lsystemAlgaeDescriptor,
  lsystemTreeDescriptorFactory,
  lsystemKochSnowflakeDescriptorFactory,
  lsystemSierpinskiTriangleDescriptorFactory,
} from "@/content/lsystem/lsystem";

// Algae
export { lsystemAlgaeDescriptor };
export const lsystemAlgae = createLSystem(lsystemAlgaeDescriptor);
export const lsystemAlgaeStates = [lsystemAlgae.descriptor.axiom];
for (let i = 1; i <= 6; i++) {
  const newState = iteratedLSystem(lsystemAlgae);
  ++lsystemAlgae.generation;
  lsystemAlgae.state = newState;
  lsystemAlgaeStates.push(newState);
}


// Sierpinski Triangle
export const lsystemSierpinski = createLSystem(lsystemSierpinskiTriangleDescriptorFactory(120));
// Koch's Snowflake
export const lsystemKochSnowflake = createLSystem(lsystemKochSnowflakeDescriptorFactory(60));
// "Tree"
export const lsystemTree = createLSystem(lsystemTreeDescriptorFactory(22.5));
