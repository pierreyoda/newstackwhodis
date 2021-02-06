import { AppProps } from "next/app";
import { FunctionComponent } from "react";
import { GlobalStyles } from "twin.macro";

import { storeWrapper } from "@/store";
import MainLayout from "@/layouts/MainLayout";

const PracaWebsiteApp: FunctionComponent<AppProps> = ({ Component, pageProps }) => (
  <MainLayout>
    <GlobalStyles />
    <Component {...pageProps} />
  </MainLayout>
);

export default storeWrapper.withRedux(PracaWebsiteApp);
