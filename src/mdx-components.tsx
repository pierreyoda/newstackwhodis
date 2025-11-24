import type { MDXComponents } from "mdx/types";

import { HighlightedCode } from "./components/blog/HighlightedCode";

const components = {
  pre: ({
    children: {
      props: { children: src, className: lang },
    },
  }) => <HighlightedCode src={src} lang={lang} />,
} satisfies MDXComponents;

export const useMDXComponents = (): MDXComponents => components;
