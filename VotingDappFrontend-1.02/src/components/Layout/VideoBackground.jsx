import React from "react";

const VideoBackground = () => {
  return (
    <video
      className="video-bg"
      src="/blockchain-bg.mp4"
      autoPlay
      muted
      loop
      playsInline
      aria-hidden="true"
    />
  );
};

export default VideoBackground;
