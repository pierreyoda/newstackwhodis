import { NextPage } from "next";

/**
 * Allows to use the `getLayout` per-page pattern on a layout basis to avoid repetition.
 *
 * @see https://adamwathan.me/2019/10/17/persistent-layout-patterns-in-nextjs/
 */
export type LayoutGetter = (page: NextPage) => JSX.Element;
