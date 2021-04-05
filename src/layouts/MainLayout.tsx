import { createContext, FunctionComponent } from "react";
import { useRouter } from "next/router";
import Head from "next/head";

import MobileFooter from "@/components/layout/MobileFooter";
import SidePanel, { SidePanelSelectableCategory } from "@/components/layout/Navbar";
import { LayoutGetter } from "./types";

export const MainLayoutContext = createContext<{
  selectedCategory: SidePanelSelectableCategory | null;
}>({
  selectedCategory: null,
});

const MainLayout: FunctionComponent = ({ children }) => {
  const router = useRouter();
  const selectedCategory: SidePanelSelectableCategory =
    router.asPath === "/blog/about" ? "about" : router.route === "/blog/[slug]" ? "blog" : "projects";

  return (
    <div id="app" className="flex flex-col justify-between w-full h-full font-sans antialiased">
      <Head>
        <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no" />
      </Head>

      <MainLayoutContext.Provider
        value={{
          selectedCategory,
        }}
      >
        <div className="flex flex-col flex-grow w-full md:flex-row">
          <SidePanel selected={selectedCategory} />
          <main className="flex-grow px-2 pt-2 overflow-auto md:pt-28 md:px-0">{children}</main>
        </div>
      </MainLayoutContext.Provider>

      <div className="w-full mt-4 md:hidden">
        <MobileFooter className="md:hidden" />
      </div>

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
