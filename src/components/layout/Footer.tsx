import { FunctionComponent } from "react";

const copyrightNotice = `Copyright © ${new Date().getFullYear()} Pierre-Yves Diallo`;

export const Footer: FunctionComponent = () => (
  <footer className="flex items-center justify-center px-4 py-6">
    <span className="text-sm text-gray-lighter">{copyrightNotice}</span>
  </footer>
);
