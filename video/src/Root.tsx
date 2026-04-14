import React from "react";
import { Composition } from "remotion";
import { CinematicTrailer } from "./CinematicTrailer";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="CinematicTrailer"
        component={CinematicTrailer}
        durationInFrames={180} // 6 seconds at 30fps
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};
