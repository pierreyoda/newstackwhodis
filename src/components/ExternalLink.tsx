import { FunctionComponent, HTMLAttributeAnchorTarget, ReactNode, useMemo } from "react";

interface ExternalLinkProps {
  href: string;
  newTab?: boolean;
  children: ReactNode;
}

export const ExternalLink: FunctionComponent<ExternalLinkProps> = ({
  href,
  newTab = true,
  children,
}) => {
  const target = useMemo((): HTMLAttributeAnchorTarget => newTab ? "_blank" : "_self", [newTab]);
  return (
    <a href={href} target={target} rel="noopener noreferrer" className="no-underline">
      {children}
    </a>
  );
};
