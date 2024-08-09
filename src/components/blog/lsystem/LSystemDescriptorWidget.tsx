import { FunctionComponent, useMemo } from "react";

import { LSystemAlphabetConstant, LSystemAlphabetVariable, LSystemDescriptor } from "@/content/lsystem/lsystem";

interface LSystemDescriptorWidgetProps {
  descriptor: LSystemDescriptor<string>;
}

type LSystemAlphabetDescription = {
  constants: readonly [string, LSystemAlphabetConstant][];
  variables: readonly [string, LSystemAlphabetVariable][];
};

export const LSystemDescriptorWidget: FunctionComponent<LSystemDescriptorWidgetProps> = ({ descriptor }) => {
  const { constants, variables } = useMemo(
    () =>
      Object.entries(descriptor.rules).reduce(
        (acc: LSystemAlphabetDescription, [letter, description]): LSystemAlphabetDescription =>
          description.type === "constant"
            ? {
                constants: [...acc.constants, [letter, description]],
                variables: acc.variables,
              }
            : {
                constants: acc.constants,
                variables: [...acc.variables, [letter, description]],
              },
        {
          constants: [],
          variables: [],
        } as LSystemAlphabetDescription,
      ),
    [descriptor.rules],
  );

  return (
    <div className="lsystem-descriptor-container rounded bg-white p-3 text-black-lighter">
      <p className="mb-2 border-b border-lychee text-lg font-semibold">{descriptor.name}</p>
      <p>Axiom: {descriptor.axiom}</p>
      {constants.length > 0 && (
        <div className="section">
          <p>Constants:</p>
          <ul>
            {constants.map(([letter, constant]) => (
              <li key={letter}>
                <span className="letter">{letter}</span>:&nbsp;
                {constant.description}
              </li>
            ))}
          </ul>
        </div>
      )}
      <div className="section">
        <p>Variables:</p>
        <ul>
          {variables.map(([letter, variable]) => (
            <li key={letter}>
              <span className="letter">{letter}</span> =&gt;:&nbsp;
              {variable.production}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
