// TODO: maybe setup into working remark/rehype Mdsvex plugin

import { FunctionComponent } from "react";

interface VideoPlayerProps {
  src: string;
  title: string;
}

export const VideoPlayer: FunctionComponent<VideoPlayerProps> = ({ src, title }) => (
  <video src={src} title={title} playsInline autoPlay muted loop className="max-h-full w-full" />
);
