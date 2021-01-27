import React, { FunctionComponent } from "react";
import Link from "next/link";

interface NavbarProps {
  links: readonly {
    /** **Internal** page link. */
    href: string;
    label: string;
  }[];
}

const Navbar: FunctionComponent<NavbarProps> = ({
  links,
}) => (
  <nav className="text-xl">
    <ul className="flex flex-wrap">
      {links.map(({ href, label }) => (
        <li key={href} className="mr-6 appearance-none">
          <Link href={href}>
            <a className="text-gray-700 hover:underline">
              {label}
            </a>
          </Link>
        </li>
      ))}
    </ul>
  </nav>
);

export default Navbar;
