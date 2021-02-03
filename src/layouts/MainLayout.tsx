import React, { FunctionComponent } from "react";
import Head from "next/head";

import Navbar from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const MainLayout: FunctionComponent = ({ children }) => (
  <div id="app" className="antialiased w-full h-full font-sans flex flex-col">

    <Head>
      <meta
        name="viewport"
        content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no"
      />
    </Head>

    <div className="absolute top-0 right-O w-12 h-8">
      {/* TODO: dark mode toggle */}
    </div>

    <Navbar />
    <main className="flex-grow overflow-auto">
      {children}
    </main>
    <Footer />

    <style jsx>
    {`
      html, body {
        height: 100%;
        display: flex;
        flex-direction: column;
      }

      #app {
        @apply text-gray-700 bg-gray-100;
        @apply dark:text-gray-300 dark:bg-gray-700;
      }
    `}
    </style>
  </div>
);

export default MainLayout;
