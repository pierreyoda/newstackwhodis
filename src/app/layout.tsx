import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";

import "./globals.css";
import { headers } from "next/headers";
import { Footer } from "@/components/Footer";
import { Navbar, NavigationSelectableCategory } from "@/components/Navbar";

export const metadata: Metadata = {
  title: "newstackwhodis",
  description: "pierreyoda's awesome tech blog",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const path = headers().get("x-pathname") ?? "/";
  const category: NavigationSelectableCategory = path === "/blog/about" ? "about" : path.startsWith("/blog") ? "blog" : "projects";
  return (
    <html lang="en" className="h-full bg-black-darker">
      <body className="font-sans antialiased flex flex-col w-full h-full">
        <Navbar category={category} />
        <main className="flex-grow px-2 pt-2 overflow-auto md:px-0">
          {children}
        </main>
        <Footer />
        <Analytics mode="auto" />
      </body>
    </html>
  );
};
