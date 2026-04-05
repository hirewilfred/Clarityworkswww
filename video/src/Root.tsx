import React from "react";
import { Composition } from "remotion";
import { AIReceptionistTrailer } from "./AIReceptionistTrailer";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="AIReceptionistTrailer"
        component={AIReceptionistTrailer}
        durationInFrames={30 * 45} // 45 seconds at 30fps
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};
