import React, { useEffect, useState, useRef, FC } from "react";
import {
  TransactionContext,
  ITransactionContext,
} from "../context/transaction";
import Title from "../components/Title";
import QRCode from "qrcode";

export interface IQr {
  data: null | string;
}

export const Qr: FC<IQr> = ({ data }) => {
  let canvasRef = useRef<HTMLCanvasElement>(null);
  let [invalidData, setInvalidData] = useState(false);

  useEffect(() => {
    if (data != null) {
      buildQrToSing();
    }
  }, [data]);

  async function buildQrToSing() {
    if (data != null && canvasRef.current != null) {
      const canvas = canvasRef.current;
      QRCode.toCanvas(canvas, data, function (error: any) {
        if (error) console.error(error);
      });
    }
  }

  return (
    <div
      className={`${
        data == null ? "skeleton" : ""
      } h-[350px] w-[350px] flex justify-center items-center`}
    >
      <canvas
        id="qr"
        className={data == null ? "hidden" : ""}
        ref={canvasRef}
      />
    </div>
  );
};

export default Qr;
