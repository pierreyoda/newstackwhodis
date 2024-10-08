import { Html, Head, Main, NextScript, DocumentProps } from "next/document";
import { FunctionComponent } from "react";

const CustomDocument: FunctionComponent<DocumentProps> = () => (
  <Html lang="en">
    <Head />
    <body>
      <Main />
      <NextScript />
    </body>
  </Html>
);

export default CustomDocument;
