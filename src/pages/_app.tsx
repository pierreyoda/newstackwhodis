import { AppProps } from "next/app";
import { FunctionComponent } from "react";

import "@/styles/globals.scss";
import MainLayout from "@/layouts/MainLayout";

const PracaWebsiteApp: FunctionComponent<AppProps> = ({ Component, pageProps }) => (
  <MainLayout>
    <Component {...pageProps} />
  </MainLayout>
);

export default PracaWebsiteApp;
