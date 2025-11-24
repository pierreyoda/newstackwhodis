import { codeToHtml } from "shiki";
import { FunctionComponent, useLayoutEffect, useMemo, useState } from "react";

const SHIKI_THEME = "dark-plus";
const LANGUAGE_STRING_PRESET = "language-";

interface HighlightedCodeProps {
  src: string;
  lang: string;
}

export const HighlightedCode: FunctionComponent<HighlightedCodeProps> = ({ src, lang }) => {
  const language = useMemo(() => lang.substring(LANGUAGE_STRING_PRESET.length), [lang]);
  const [codeHTML, setCodeHTML] = useState("");
  useLayoutEffect(() => {
    (async () => {
      const html = await codeToHtml(src, { lang: language, theme: SHIKI_THEME });
      setCodeHTML(html);
    })();
  }, [src, language]);

  return <div dangerouslySetInnerHTML={{ __html: codeHTML }}></div>;
};
