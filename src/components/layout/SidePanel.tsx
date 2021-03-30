import { FunctionComponent } from "react";
import Link from "next/link";
import clsx from "clsx";

import { siteName, copyrightNotice } from "@/content/branding";

export const sidePanelSelectableCategories = ["blog", "projects", "about"] as const;
export type SidePanelSelectableCategory = typeof sidePanelSelectableCategories[number];

const SidePanelLink: FunctionComponent<{
  href: string;
  label: string;
  selected: boolean;
}> = ({ href, label, selected }) => (
  <div className={clsx("mt-8 text-white hover:text-lychee", selected && "text-lychee")}>
    <Link href={href}>{label}</Link>
  </div>
);

interface SidePanelProps {
  selected: SidePanelSelectableCategory | null;
}

const SidePanel: FunctionComponent<SidePanelProps> = ({ selected }) => (
  <div className="flex flex-col w-1/3 p-3 text-white bg-black md:p-12">
    <div className="flex">
      <h2 className="text-3xl">{siteName}</h2>
    </div>
    <div className="flex-col justify-between flex-grow">
      <SidePanelLink href="/" label="Projects" selected={selected === "projects"} />
      <SidePanelLink href="/blog/about/" label="About" selected={selected === "about"} />
    </div>
    <footer className="flex items-center justify-center text-sm text-gray-200">
      <span>{copyrightNotice}</span>
    </footer>
  </div>
);

export default SidePanel;
