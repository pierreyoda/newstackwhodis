import { FunctionComponent } from "react";
import Link from "next/link";
import clsx from "clsx";

import { copyrightNotice } from "@/content/branding";

export const sidePanelSelectableCategories = ["blog", "projects", "about"] as const;
export type SidePanelSelectableCategory = typeof sidePanelSelectableCategories[number];

const SidePanelLink: FunctionComponent<{
  href: string;
  label: string;
  selected: boolean;
}> = ({ href, label, selected }) => (
  <div className="mr-6 md:mr-0 md:mt-8">
    <Link href={href} passHref>
      <a href="/" className={clsx("hover:text-lychee", selected ? "text-lychee" : "text-white")}>
        {label}
      </a>
    </Link>
  </div>
);

interface SidePanelProps {
  selected: SidePanelSelectableCategory | null;
}

const SidePanel: FunctionComponent<SidePanelProps> = ({ selected }) => (
  <div className="flex items-center flex-shrink-0 w-full p-3 text-white bg-black md:flex-col md:w-1/3 md:p-12">
    <div className="flex items-center mr-8 md:mr-0">
      <img className="w-32 h-auto md:w-64" src="/brand.svg" alt="Praca" />
    </div>
    <div className="flex items-center flex-grow md:justify-start md:flex-col md:text-xl">
      <SidePanelLink href="/" label="Projects" selected={selected === "projects"} />
      <SidePanelLink href="/blog/about/" label="About" selected={selected === "about"} />
    </div>
    <footer className="items-center justify-center hidden text-sm text-gray-200 md:flex">
      <span>{copyrightNotice}</span>
    </footer>
  </div>
);

export default SidePanel;
