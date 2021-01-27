import React from "react";
import { AppProps } from "next/app";

import "@/styles/globals.css";
import MainLayout from "@/layouts/Main";

const PracaWebsiteApp = ({
  Component,
  pageProps,
}: AppProps) => (
  <MainLayout>
    <Component {...pageProps} />
  </MainLayout>
);

export default PracaWebsiteApp;
