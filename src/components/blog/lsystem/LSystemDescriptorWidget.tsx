import clsx from "clsx";
import { FunctionComponent, ReactNode, useMemo } from "react";

import { LSystemAlphabetConstant, LSystemAlphabetVariable, LSystemDescriptor } from "@/content/lsystem/lsystem";

interface LSystemDescriptorWidgetProps {
  descriptor: LSystemDescriptor<string>;
}

type LSystemAlphabetDescription = {
  constants: readonly [string, LSystemAlphabetConstant][];
  variables: readonly [string, LSystemAlphabetVariable][];
};

/** A single letter of the alphabet, as a chip: variables in orange, constants in white. */
const LSystemLetter: FunctionComponent<{ letter: string; isVariable: boolean }> = ({ letter, isVariable }) => (
  <span
    className={clsx(
      "bg-space inline-flex h-7 min-w-7 items-center justify-center rounded-md px-1 font-mono text-sm font-bold",
      isVariable ? "text-orange" : "text-white",
    )}
  >
    {letter}
  </span>
);

/** A word over the alphabet (axiom, production), its variables highlighted in orange. */
const LSystemWord: FunctionComponent<{ word: string; variables: ReadonlySet<string> }> = ({ word, variables }) => (
  <code className="font-mono text-sm leading-5 tracking-widest break-all text-white">
    {Array.from(word, (letter, i) =>
      variables.has(letter) ? (
        <span key={i} className="text-orange">
          {letter}
        </span>
      ) : (
        letter
      ),
    )}
  </code>
);

const LSystemDescriptorSection: FunctionComponent<{ label: string; children: ReactNode }> = ({ label, children }) => (
  <div className="flex flex-col gap-2 md:flex-row md:gap-4">
    <dt className="text-gray-lighter text-xs font-semibold tracking-wider uppercase md:w-24 md:shrink-0 md:leading-7">
      {label}
    </dt>
    <dd className="min-w-0">{children}</dd>
  </div>
);

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
        } satisfies LSystemAlphabetDescription,
      ),
    [descriptor.rules],
  );
  const variableLetters = useMemo(() => new Set(variables.map(([letter]) => letter)), [variables]);

  return (
    <figure className="border-gray flex flex-col gap-5 rounded-lg border bg-black p-4 md:p-5">
      <figcaption className="flex flex-col items-start gap-1">
        <span className="text-gray-lighter text-xs font-semibold tracking-wider uppercase">L-System</span>
        <span className="border-lychee border-b-2 text-lg font-bold text-white">{descriptor.name}</span>
      </figcaption>
      <dl className="flex flex-col gap-4">
        <LSystemDescriptorSection label="Axiom">
          <div className="py-1">
            <LSystemWord word={descriptor.axiom} variables={variableLetters} />
          </div>
        </LSystemDescriptorSection>
        <LSystemDescriptorSection label="Variables">
          <dl className="flex flex-col gap-2">
            {variables.map(([letter, variable]) => (
              <div key={letter} className="flex items-start gap-3">
                <dt className="shrink-0">
                  <LSystemLetter letter={letter} isVariable />
                </dt>
                <dd className="flex min-w-0 items-start gap-3 py-1">
                  <span aria-hidden="true" className="text-gray-lighter text-sm leading-5">
                    →
                  </span>
                  <span className="sr-only">becomes</span>
                  <LSystemWord word={variable.production} variables={variableLetters} />
                </dd>
              </div>
            ))}
          </dl>
        </LSystemDescriptorSection>
        {constants.length > 0 && (
          <LSystemDescriptorSection label="Constants">
            <dl className="flex flex-col gap-2">
              {constants.map(([letter, constant]) => (
                <div key={letter} className="flex items-start gap-3">
                  <dt className="shrink-0">
                    <LSystemLetter letter={letter} isVariable={false} />
                  </dt>
                  <dd className="py-1 text-sm leading-5">{constant.description}</dd>
                </div>
              ))}
            </dl>
          </LSystemDescriptorSection>
        )}
      </dl>
    </figure>
  );
};
