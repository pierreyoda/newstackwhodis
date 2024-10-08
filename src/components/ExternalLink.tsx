import clsx from "clsx";
import { FunctionComponent, HTMLAttributeAnchorTarget, ReactNode, useMemo } from "react";

interface ExternalLinkProps {
  href: string;
  /** True by default. */
  newTab?: boolean;
  children: ReactNode;
  className?: string;
}

export const ExternalLink: FunctionComponent<ExternalLinkProps> = ({ href, newTab = true, children, className }) => {
  const target = useMemo((): HTMLAttributeAnchorTarget => (newTab ? "_blank" : "_self"), [newTab]);
  return (
    <a href={href} target={target} rel="noopener noreferrer" className={clsx("no-underline", className)}>
      {children}
    </a>
  );
};
