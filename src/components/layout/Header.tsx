import React, { FunctionComponent } from "react";
import Link from "next/link";

import Branding from "@/content/branding";

interface Link {
  href: string;
  label: string;
}

const links: readonly Link[] = [
  { href: "/", label: "Home" },
  { href: "/projects/", label: "Projects" },
  { href: "/about/", label: "About" },
];

const Header: FunctionComponent = () => (
  <header className="w-full h-16 bg-gray-700 text-blue-100">
    <nav className="mx-auto container flex flex-col sm:flex-row items-center justify-center sm:justify-between p-4 text-xl">
      <h2>
        <Link href="/">
          <a className="transition-colors duration-300 hover:text-blue-500">
            {Branding.name}
          </a>
        </Link>
      </h2>
      <ul className="flex flex-wrap">
        {links.map(({ href, label }) => (
          <li key={href} className="mr-6 appearance-none">
            <Link href={href}>
              <a className="transition-colors duration-300 hover:text-blue-200">
                {label}
              </a>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  </header>
);

export default Header;
