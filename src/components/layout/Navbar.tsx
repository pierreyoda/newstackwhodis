import clsx from "clsx";
import Link from "next/link";
import { FunctionComponent } from "react";
import { ExternalLink } from "../ExternalLink";

interface NavbarLinkProps {
  href: string;
  label: string;
  selected: boolean;
}

const NavbarLink: FunctionComponent<NavbarLinkProps> = ({ href, label, selected }) => (
  <li className="mr-8 last:mr-0">
    <Link href={href} className={clsx("cursor-pointer text-white hover:text-lychee", selected && "text-lychee")}>
      {label}
    </Link>
  </li>
);

export const navigationSelectableCategories = ["projects", "blog", "about"] as const;
export type NavigationSelectableCategory = typeof navigationSelectableCategories[number];

interface NavbarProps {
  category: NavigationSelectableCategory;
}

export const Navbar: FunctionComponent<NavbarProps> = ({ category }) => (
  <div className="flex flex-col">
    <div className="w-full flex justify-center items-center mr-12 text-white font-bold py-6">
      <Link href="/">
        newstackwhodis (Work In Progress)
      </Link>
    </div>
    <div className="w-full flex flex-col md:flex-row self-center items-center justify-between">
      <div />
      <header className="flex items-center p-2 max-w-3xl mx-auto text-gray-lighter md:text-xl">
        <nav className="flex items-center flex-grow">
          <ul className="flex items-center flex-grow md:text-xl">
            <NavbarLink href="/" label="Projects" selected={category === "projects"} />
            <NavbarLink href="/blog" label="Blog" selected={category === "blog"} />
            <NavbarLink href="/blog/about" label="About" selected={category === "about"} />
          </ul>
        </nav>
      </header>
    </div>
    <div className={clsx("text-white font-semibold py-2 md:py-0", category === "blog" && "hidden")}>
      <ExternalLink href="https://github.com/pierreyoda/newstackwhodis">
        GitHub
      </ExternalLink>
    </div>
  </div>
);
