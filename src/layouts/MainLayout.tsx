import { FunctionComponent, useState } from "react";
import Head from "next/head";
import "twin.macro";

import { LayoutGetter } from "./types";
import SidePanel, { SidePanelSelectableCategory } from "@/components/layout/SidePanel";
import ContentPanel from "@/components/layout/ContentPanel";

const MainLayout: FunctionComponent = ({
  children,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<SidePanelSelectableCategory | null>(null);

  return (
    <div id="app" tw="flex w-full h-full font-sans antialiased">

      <Head>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no"
        />
      </Head>

      <SidePanel
        selected={selectedCategory}
        onSelectedChange={selected => setSelectedCategory(selected)}
      />
      {/* TODO: only on main page */}
      <ContentPanel highlightContentCategory={selectedCategory} />

      <main tw="flex-grow overflow-auto">
        {children}
      </main>

      <style global jsx>{`
        html,
        body,
        body > div:first-child,
        div#__next,
        div#__next > div {
          height: 100%;
        }
      `}</style>
    </div>
  );
};

export const getLayout: LayoutGetter = page => <MainLayout>{page}</MainLayout>;

export default MainLayout;
