import { FunctionComponent, useEffect, useState } from "react";
import { VideoPlayer } from "./VideoPlayer";
import { MDXRemote, MDXRemoteSerializeResult } from "next-mdx-remote";
import { serialize } from "next-mdx-remote/serialize";

const components = {
  VideoPlayer,
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
