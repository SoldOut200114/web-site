import { useEffect, useRef, useState } from "react";
import { Button } from "antd";

import Video from "./Video";

const { io } = require("socket.io-client");

const config = {
  audio: true,
  video: { facingMode: "user" },
};

/**
 * 整体流程：
 * 1，点击按钮，加入房间，分配唯一id
 * 2，通过唯一id，新建socket链接
 * 3，scoket传递对应stream到后端，后端返回对应数据
 * 4，根据后端返回数据，展示对应video标签
 */
const MeetRoom = () => {
  const [stream, setStream] = useState<MediaStream>();

  const joinRoom = async () => {
    const socket = io("ws://localhost:9001", {
      withCredentials: true,
    });
    const peer = new RTCPeerConnection();
    await createWebRtc(peer);

    socket.on("message", async (data) => {
      const offer = new RTCSessionDescription(data.offer);
      await peer.setRemoteDescription(offer);
      let answer = await peer.createAnswer();

      socket.emit("answer", {
        to: data.from, // 呼叫端 Socket ID
        answer,
      });
      await peer.setLocalDescription(answer);

      peer.onicecandidate = (event) => {
        if (event.candidate) {
          socket.emit("candid", {
            to: data.from, // 呼叫端 Socket ID
            candid: event.candidate,
          });
        }
      };
    });

    socket.on("candid", (data) => {
      let candid = new RTCIceCandidate(data.candid);
      peer.addIceCandidate(candid);
    });

    socket.on("answer", (data) => {
      let answer = new RTCSessionDescription(data.answer);
      peer.setRemoteDescription(answer);
    });
  };

  const getUserStream = async () => {
    return navigator.mediaDevices.getUserMedia(config);
  };

  const createWebRtc = async (peer) => {
    const userStream = await getUserStream();
    userStream.getTracks().forEach((track) => {
      peer.addTrack(track, userStream);
    });
    peer.ontrack = async (event) => {
      const [remoteStream] = event.streams;
      setStream(remoteStream);
    };

    return peer;
  };

  return (
    <div className="common-layout meet-room">
      <Button onClick={joinRoom}>加入房间</Button>
      <Video stream={stream} />
    </div>
  );
};

export default MeetRoom;
