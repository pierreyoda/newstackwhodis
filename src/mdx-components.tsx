import type { MDXComponents } from "mdx/types";

import { HighlightedCode } from "./components/blog/HighlightedCode";

const components = {
  pre: ({
    children: {
      props: { children: src, className: lang, ...rest },
    },
  }) => <HighlightedCode src={src} lang={lang} rest={rest} />,
} satisfies MDXComponents;

export const useMDXComponents = (): MDXComponents => components;
