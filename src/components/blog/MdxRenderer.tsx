import { serialize } from "next-mdx-remote/serialize";
import { FunctionComponent, useEffect, useState } from "react";
import { MDXRemote, MDXRemoteSerializeResult } from "next-mdx-remote";

import { VideoPlayer } from "./VideoPlayer";
import { LSystemDescriptorWidget } from "./lsystem/LSystemDescriptorWidget";
import { LSystemControllableTracingRenderer } from "./lsystem/LSystemControllableTracingRenderer";

const components = {
  // general
  VideoPlayer,
  // L-Systems
  LSystemDescriptorWidget,
  LSystemControllableTracingRenderer,
};

interface MdxRendererProps {
  source: string;
}

export const MdxRenderer: FunctionComponent<MdxRendererProps> = ({ source }) => {
  const [compiled, setCompiled] = useState<MDXRemoteSerializeResult | null>(null);
  useEffect(
    () => {
      const compile = async () => setCompiled(await serialize(source, {
        parseFrontmatter: true,
      }));
      compile();
    },
    [source],
  );
  return compiled ? (
    <MDXRemote {...compiled} components={components} />
  ) : null;
};
