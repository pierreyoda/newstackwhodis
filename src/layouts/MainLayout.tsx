import { createContext, FunctionComponent, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import "twin.macro";

import SidePanel, { SidePanelSelectableCategory } from "@/components/layout/SidePanel";
import { LayoutGetter } from "./types";

export const MainLayoutContext = createContext<{
  selectedCategory: SidePanelSelectableCategory | null;
}>({
  selectedCategory: null,
});

const MainLayout: FunctionComponent = ({ children }) => {
  const router = useRouter();
  const selectedCategory: SidePanelSelectableCategory =
    router.asPath === "/blog/1-about" ? "about" : router.route === "/blog/[slug]" ? "blog" : "projects";

  return (
    <div id="app" tw="flex w-full h-full font-sans antialiased">
      <Head>
        <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no" />
      </Head>

      <SidePanel selected={selectedCategory} />

      <MainLayoutContext.Provider
        value={{
          selectedCategory,
        }}
      >
        <main tw="flex-grow overflow-auto pt-2 md:pt-28">{children}</main>
      </MainLayoutContext.Provider>

      <style global jsx>
        {`
          html,
          body,
          div#__next,
          div#__next > div {
            height: 100%;
          }
        `}
      </style>
    </div>
  );
};

export const getLayout: LayoutGetter = page => <MainLayout>{page}</MainLayout>;

export default MainLayout;
