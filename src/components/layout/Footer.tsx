import Branding from "@/content/branding";
import React, { FunctionComponent } from "react";

const Footer: FunctionComponent = () => (
  <footer className="w-full h-8 p-2 bg-gray-800 text-blue-100 text-sm text-center">
    {Branding.copyrightNotice}
  </footer>
);

export default Footer;
