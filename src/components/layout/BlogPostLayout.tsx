import { FunctionComponent, ReactNode } from "react";

import "@/styles/prism-vs-code-dark.css";

interface BlogPostLayoutProps {
  children: ReactNode;
}

const BlogPostLayout: FunctionComponent<BlogPostLayoutProps> = ({ children }) => (
  <section className="blog-post-container">{children}</section>
);

export default BlogPostLayout;
