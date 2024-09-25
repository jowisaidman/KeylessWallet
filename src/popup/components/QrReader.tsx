import React, { FC, useEffect, useState, useRef } from "react";
import QrScanner from "qr-scanner";

export interface IQrReader {
  readInterval: number;
  onSuccess: (result: string) => void;
}

const constraints = {
  audio: false,
  video: {
    width: 1280,
    height: 720,
  },
};

declare global {
  interface Window {
    stream: any;
  }
}

export const QrReader: FC<IQrReader> = ({ readInterval, onSuccess }) => {
  let video = useRef<HTMLVideoElement>(null);
  let canvas = useRef<HTMLCanvasElement>(null);
  let [scanning, setScanning] = useState<boolean>(true);

  function capture() {
    if (canvas.current != null && video.current != null) {
      let context: any = canvas.current?.getContext("2d");
      context.canvas.width = video.current?.offsetWidth;
      context.canvas.height = video.current?.offsetHeight;
      context.drawImage(
        video.current!,
        0,
        0,
        video.current!.offsetWidth,
        video.current!.offsetHeight
      );
    }
  }

  function stopStream() {
    if (scanning && canvas.current != null && video.current != null) {
      window.stream.getTracks().forEach(function (track: any) {
        track.stop();
      });
    }
  }

  useEffect(() => {
    if (scanning && canvas.current != null && video.current != null) {
      navigator.mediaDevices
        .getUserMedia(constraints)
        .then((stream) => {
          window.stream = stream;
          video.current!.srcObject = stream;
        })
        .catch((e) => {
          console.log(`navigator.getUserMedia error:${e.toString()}`);
        });

      let intervalId = setInterval(() => {
        capture();
        QrScanner.scanImage(canvas.current!)
          .then((result: string) => {
            clearInterval(intervalId);
            stopStream();
            onSuccess(result);
          })
          .catch((error: any) => console.log(error));
      }, readInterval);

      return stopStream;
    } else {
      stopStream();
    }
  }, [scanning, canvas, video]);

  return (
    <div>
      <canvas ref={canvas} className="hidden"></canvas>
      <video ref={video} className="max-h-64" playsInline autoPlay></video>
    </div>
  );
};

export default QrReader;
