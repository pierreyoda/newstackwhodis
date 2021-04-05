import { FunctionComponent } from "react";

import { copyrightNotice } from "@/content";

const MobileFooter: FunctionComponent<{ className?: string }> = () => (
  <footer className="flex flex-col w-full p-3 text-white bg-black">
    <span className="text-sm text-center">{copyrightNotice}</span>
  </footer>
);

export default MobileFooter;
