import { FunctionComponent } from "react";
import Link from "next/link";
import tw from "twin.macro";

import { siteName, copyrightNotice } from "@/content/branding";

export const sidePanelSelectableCategories = ["blog", "projects", "about"] as const;
export type SidePanelSelectableCategory = typeof sidePanelSelectableCategories[number];

const SidePanelLink: FunctionComponent<{
  href: string;
  label: string;
  selected: boolean;
}> = ({ href, label, selected }) => (
  <div css={[tw`mt-8 text-white cursor-pointer hover:text-lychee`, selected && tw`text-lychee`]}>
    <Link href={href}>{label}</Link>
  </div>
);

interface SidePanelProps {
  selected: SidePanelSelectableCategory | null;
}

const SidePanel: FunctionComponent<SidePanelProps> = ({ selected }) => (
  <div tw="w-1/3 bg-black text-white flex flex-col p-3 md:p-12">
    <div tw="flex">
      <h2 tw="text-3xl">{siteName}</h2>
    </div>
    <div tw="flex-grow flex-col justify-between">
      <SidePanelLink href="/" label="Projects" selected={selected === "projects"} />
      <SidePanelLink href="/blog/about/" label="About" selected={selected === "about"} />
    </div>
    <footer css="flex items-center justify-center text-sm text-gray-200">
      <span>{copyrightNotice}</span>
    </footer>
  </div>
);

export default SidePanel;
