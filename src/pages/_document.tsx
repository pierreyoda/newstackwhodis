import Document, {
  Html,
  Head,
  Main,
  NextScript,
} from "next/document";

class PracaDocument extends Document {
  // static async getInitialProps(context: DocumentContext): Promise<DocumentInitialProps> {
  //   const initialProps = await Document.getInitialProps(context);
  //   return { ...initialProps };
  // }

  render(): JSX.Element {
    return (
      <Html>
        <Head />
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default PracaDocument;
