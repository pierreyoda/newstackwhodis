import clsx from "clsx";
import Link from "next/link";
import { FunctionComponent, ReactNode } from "react";

import { Icon } from "../Icon";
import { ExternalLink } from "../ExternalLink";
import { HNCLI_WEBSITE_URL } from "@/content/constants";

const GITHUB_PROFILE_URL = "https://github.com/pierreyoda/";

interface NavbarLinkProps {
  href: string;
  label: string;
  selected: boolean;
}

/** Tab-like link: the selected one is underlined, on top of the navbar's bottom border. */
const NavbarLink: FunctionComponent<NavbarLinkProps> = ({ href, label, selected }) => (
  <li>
    <Link
      href={href}
      aria-current={selected ? "page" : undefined}
      className={clsx(
        "-mb-px block border-b-2 py-3 font-medium transition-colors md:py-5",
        selected ? "border-lychee text-white" : "text-gray-lighter border-transparent hover:text-white",
      )}
    >
      {label}
    </Link>
  </li>
);

const NavbarExternalLink: FunctionComponent<{ href: string; children: ReactNode }> = ({ href, children }) => (
  <ExternalLink
    href={href}
    className="group text-light-orange/70 hover:text-light-orange inline-flex items-center gap-1 transition-colors"
  >
    {children}
    <Icon
      name="arrow-up-right"
      className="h-3.5 w-3.5 transition-transform group-hover:translate-x-px group-hover:-translate-y-px"
    />
    <span className="sr-only">(opens in a new tab)</span>
  </ExternalLink>
);

export const navigationSelectableCategories = ["projects", "blog", "about"] as const;
export type NavigationSelectableCategory = (typeof navigationSelectableCategories)[number];

interface NavbarProps {
  category: NavigationSelectableCategory;
}

/**
 * Single row on desktop (brand, navigation, external links).
 * On mobile, the navigation wraps below the brand and the external links.
 */
export const Navbar: FunctionComponent<NavbarProps> = ({ category }) => (
  <header className="border-gray mx-auto mb-4 w-full max-w-3xl border-b px-2 md:px-0">
    <div className="flex flex-wrap items-center justify-between gap-x-8 md:flex-nowrap">
      <Link href="/" className="pt-4 text-lg font-extrabold tracking-tight text-white md:pt-0">
        newstack<span className="text-lychee">whodis</span>
      </Link>
      <nav aria-label="Main" className="order-last w-full md:order-none md:w-auto md:grow">
        <ul className="flex items-center gap-6 md:gap-7">
          <NavbarLink href="/" label="Projects" selected={category === "projects"} />
          <NavbarLink href="/blog" label="Blog" selected={category === "blog"} />
          <NavbarLink href="/blog/about" label="About" selected={category === "about"} />
        </ul>
      </nav>
      <div className="flex items-center gap-5 pt-4 text-sm font-semibold md:pt-0">
        <NavbarExternalLink href={HNCLI_WEBSITE_URL}>hncli</NavbarExternalLink>
        <NavbarExternalLink href={GITHUB_PROFILE_URL}>GitHub</NavbarExternalLink>
      </div>
    </div>
  </header>
);
