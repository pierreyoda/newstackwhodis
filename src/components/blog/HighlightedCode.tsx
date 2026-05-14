"use server";

import { codeToHtml } from "shiki";
import { transformerTwoslash } from "@shikijs/twoslash";
import { FunctionComponent, useLayoutEffect, useMemo, useState } from "react";

const SHIKI_THEME = "dark-plus";
const LANGUAGE_STRING_PRESET = "language-";

interface HighlightedCodeProps {
  src: string;
  lang: string;
  rest: any;
}

export const HighlightedCode: FunctionComponent<HighlightedCodeProps> = ({ src, lang, rest }) => {
  console.log(rest);
  const language = useMemo(() => lang.substring(LANGUAGE_STRING_PRESET.length), [lang]);
  const [codeHTML, setCodeHTML] = useState<TrustedHTML>("");
  useLayoutEffect(() => {
    (async () => {
      console.log(language);
      const html = await codeToHtml(src, {
        lang: language,
        theme: SHIKI_THEME,
        transformers: ["ts", "typescript"].includes(language)
          ? [
              transformerTwoslash({
                explicitTrigger: true,
              }),
            ]
          : [],
      });
      setCodeHTML(html);
    })();
  }, [src, language]);

  return <div dangerouslySetInnerHTML={{ __html: codeHTML }}></div>;
};
