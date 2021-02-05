import { FunctionComponent } from "react";
import Head from "next/head";
import "twin.macro";

// import Navbar from "@/components/layout/Header";
import SidePanel from "@/components/layout/SidePanel";

const MainLayout: FunctionComponent = ({ children }) => (
  <div id="app" tw="flex w-full h-full font-sans antialiased">

    <Head>
      <meta
        name="viewport"
        content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no"
      />
    </Head>

    <SidePanel
      selected="project"
      onSelectedChange={() => {}}
    />
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

export default MainLayout;
