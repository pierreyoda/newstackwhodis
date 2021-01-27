import React, { FunctionComponent } from "react";

import Navbar from "@/components/Navbar";
import { copyrightNotice, name } from "@/content/branding";

const MainLayout: FunctionComponent = ({ children }) => (
  <main className="antialiased w-full font-sans">
    <div className="absolute top-0 right-O h-12 w-12">
      {/* TODO: dark mode toggle */}
    </div>

    <div className="max-w-screen-lg mx-auto">
      <div className="border-b border-blue-300">
        <div className="pt-16 pb-8">
          <h1 className="font-semibold text-3xl text-blue-900">{name}</h1>
        </div>
        <Navbar links={[
          { href: "/", label: "Home" },
          { href: "/projects/", label: "Projects" },
          { href: "/about/", label: "About" },
        ]} />
      </div>
    </div>
    <div>
      <div className="text-xl py-5">
        {children}
      </div>
      <div className="border-t border-blue-300 text-center py-10 text-sm">
        {copyrightNotice}
      </div>
    </div>
  <style jsx>
    {`
      main {
        @apply text-gray-700 bg-gray-100;
        @apply dark:text-gray-300 dark:bg-gray-100;
      }

      ::selection {
        background: #E9D8FD;
        color:#202684;
      }
      ::-moz-selection {
        background: #E9D8FD;
        color:#202684;
      }

      a:not(.nav) {
        font-weight: bold;
        text-decoration: none;
        padding: 2px;
        background: linear-gradient(to right, #5A67D8, #5A67D8);
        background-repeat: repeat-x;
        background-size: 100% 2px;
        background-position: 0 95%;
        -webkit-transition: all 150ms ease-in-out;
        -moz-transition: all 150ms ease-in-out;
        -ms-transition: all 150ms ease-in-out;
        -o-transition: all 150ms ease-in-out;
        transition: all 150ms ease-in-out;
      }

      a:hover {
        color: #B794F4;
        font-weight: bold;
        text-decoration: none;
        padding-bottom: 2px;
        background: linear-gradient(to right, #9F7AEA, #E9D8FD);
        background-repeat: repeat-x;
        background-size: 100% 2px;
        background-position: 50% 95%;
        -webkit-transition: color 150ms ease-in-out;
        -moz-transition: color 150ms ease-in-out;
        -ms-transition: color 150ms ease-in-out;
        -o-transition: color 150ms ease-in-out;
        transition: color 150ms ease-in-out;
      }

      a:focus {
        outline: none;
        background: #E9D8FD;
      }
    `}
  </style>
  </main>
);

export default MainLayout;
