import clsx from "clsx";
import Head from "next/head";
import type { AppProps } from "next/app";
import { Analytics } from "@vercel/analytics/react";

import "@/styles/globals.css";
import "@/styles/prism-vs-code-dark.css";
import { Footer } from "@/components/layout/Footer";
import { Navbar, NavigationSelectableCategory } from "@/components/layout/Navbar";

const CustomApp = ({ Component, pageProps, router }: AppProps) => {
  const path = router.asPath;
  const category: NavigationSelectableCategory = path === "/blog/about" ? "about" : path.startsWith("/blog") ? "blog" : "projects";
  const inPostsList = path === "/blog";
  return (
    <div id="root" className={clsx("flex flex-col w-full h-full", category !== "blog" ? "max-w-3xl mx-auto" : "")}>
      <Head>
        <title>newstackwhodis</title>
        <meta property="description" content="pierreyoda's awesome tech blog" />
      </Head>
      <div className="flex flex-col grow w-full h-full">
        <Navbar category={category} />
        <main className={clsx("grow px-2 pt-2 overflow-auto md:px-0", category === "about" || (category === "blog" && !inPostsList) ? "blog-post-container" : "")}>
          <Component {...pageProps} />
        </main>
        <Footer />
        <Analytics mode="auto" />
      </div>
    </div>
  );
};

export default CustomApp;
