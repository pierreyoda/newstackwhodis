import Link from "next/link";
import { NextPage } from "next";

const Error404: NextPage = () => (
  <div className="flex flex-col items-center justify-center w-full h-full bg-white">
    <div className="flex flex-col text-left text-black">
      <h2 className="font-semibold text-7xl">404</h2>
      <p className="mt-1 text-xl">Page not found.</p>
      <Link href="/">
        {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
        <a className="mt-6 text-xl font-semibold no-underline text-lychee">Home</a>
      </Link>
    </div>
  </div>
);

export default Error404;
