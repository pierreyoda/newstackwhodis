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
  const category: NavigationSelectableCategory =
    path === "/blog/about" ? "about" : path.startsWith("/blog") ? "blog" : "projects";
  const inPostsList = path === "/blog";
  return (
    <div id="root" className={clsx("flex h-full w-full flex-col", category !== "blog" ? "mx-auto max-w-3xl" : "")}>
      <Head>
        <title>newstackwhodis</title>
        <meta name="description" content="pierreyoda's awesome tech blog" />
      </Head>
      <div className="flex w-full grow flex-col">
        <Navbar category={category} />
        <main
          className={clsx(
            "grow overflow-auto px-2 pt-2 md:px-0",
            category === "about" || (category === "blog" && !inPostsList) ? "blog-post-container" : "",
            category === "about" ? "hide-toc" : "",
          )}
        >
          <Component {...pageProps} />
        </main>
        <Footer />
        <Analytics mode="auto" />
      </div>
    </div>
  );
};

export default CustomApp;
