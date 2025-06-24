import clsx from "clsx";
import Link from "next/link";
import { FunctionComponent } from "react";

import { ExternalLink } from "../ExternalLink";
import { HNCLI_WEBSITE_URL } from "@/content/constants";

interface NavbarLinkProps {
  href: string;
  label: string;
  selected: boolean;
}

const NavbarLink: FunctionComponent<NavbarLinkProps> = ({ href, label, selected }) => (
  <li className="mr-8 last:mr-0">
    <Link href={href} className={clsx("hover:text-lychee cursor-pointer", selected ? "text-lychee" : "text-white")}>
      {label}
    </Link>
  </li>
);

export const navigationSelectableCategories = ["projects", "blog", "about"] as const;
export type NavigationSelectableCategory = (typeof navigationSelectableCategories)[number];

interface NavbarProps {
  category: NavigationSelectableCategory;
}

export const Navbar: FunctionComponent<NavbarProps> = ({ category }) => (
  <div className="flex flex-col">
    <div className="mr-12 flex w-full items-center justify-center py-6 font-bold">
      <Link href="/">newstackwhodis</Link>
    </div>
    <div className="flex w-full flex-col items-center justify-between self-center md:flex-row">
      <div />
      <header className="text-gray-lighter mx-auto flex max-w-3xl items-center p-2 md:text-xl">
        <nav className="flex grow items-center">
          <ul className="flex grow items-center md:text-xl">
            <NavbarLink href="/" label="Projects" selected={category === "projects"} />
            <NavbarLink href="/blog" label="Blog" selected={category === "blog"} />
            <NavbarLink href="/blog/about" label="About" selected={category === "about"} />
          </ul>
        </nav>
      </header>
      <div className="flex items-center font-semibold">
        <div className="mr-4">
          <ExternalLink href={HNCLI_WEBSITE_URL} className="text-light-orange/70 hover:text-light-orange">
            hncli
          </ExternalLink>
        </div>
        <div className={clsx("text-centerxx py-2 md:py-0", category === "blog" && "hidden")}>
          <ExternalLink href="https://github.comp/ierreyoda/" className="text-light-orange/70 hover:text-light-orange">
            GitHub
          </ExternalLink>
        </div>
      </div>
    </div>
  </div>
);
