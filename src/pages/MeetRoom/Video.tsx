import { useEffect, useRef, useState } from "react";

const config = {
  audio: true,
  video: { facingMode: "user" },
};

const Video = (props) => {
  const { stream } = props;
  const videoRef = useRef<HTMLVideoElement>();

  useEffect(() => {
    videoRef.current.srcObject = stream;
    videoRef.current.autoplay = true;
    videoRef.current.muted = true;
  }, [stream]);

  return (
    <div>
      <video ref={videoRef}></video>
    </div>
  );
};

export default Video;
