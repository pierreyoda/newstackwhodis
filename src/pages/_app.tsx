import { AppProps } from "next/app";
import { GlobalStyles } from "twin.macro";

import MainLayout from "@/layouts/MainLayout";

const PracaWebsiteApp = ({
  Component,
  pageProps,
}: AppProps) => (
  <MainLayout>
    <GlobalStyles />
    <Component {...pageProps} />
  </MainLayout>
);

export default PracaWebsiteApp;
