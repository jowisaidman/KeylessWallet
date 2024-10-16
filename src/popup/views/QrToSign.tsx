import React, { useEffect, useState, useContext } from "react";
import { Button } from "../components/Button";
import { Tabs, Tab } from "../components/Tabs";
import { WalletContext, IWalletContext } from "../context/context";
import {
  TransactionContext,
  ITransactionContext,
} from "../context/transaction";
import { changeScreen, Screen } from "../navigation";
import { getNextNonce } from "../transaction";
import QRCode from "qrcode";

export default () => {
  const walletContext = useContext<IWalletContext>(WalletContext);
  const transactionContext =
    useContext<ITransactionContext>(TransactionContext);

  useEffect(() => {
    if (transactionContext.data) {
      buildQrToSing().catch((e) =>
        console.log(`there was an error building qr to sing ${e}`)
      );
    }
  }, []);

  async function back() {
    await changeScreen(Screen.Welcome);
  }

  async function send() {
    await changeScreen(Screen.QrToRead);
  }

  async function buildQrToSing() {
    const canvas = document.getElementById("qr");
    let transaction = JSON.parse(transactionContext.data!);
    const nonce = await getNextNonce(walletContext.currentAccount!.address);
    transaction.nonce = nonce;

    console.log(JSON.stringify(transaction));

    QRCode.toCanvas(canvas, JSON.stringify(transaction), function (error: any) {
      if (error) console.error(error);
      console.log("success!");
    });
  }

  return (
    <div className="flex flex-col items-center gap-5 grow pb-5 h-full justify-between">
      <div className="text-center my-2">
        <div className="text-primary font-bold text-2xl">Sign transaction</div>
        <div className="text-secondary">
          Scan the following QR code with the offline signer to sign the
          transaction and send it to Chain
        </div>
      </div>
      <canvas id="qr" />
      <div className="flex items-center space-x-3 items-end mb-1">
        <Button
          onClick={async () => {
            await back();
          }}
          variant="secondary"
          className="px-10"
          centered
          size="lg"
        >
          Back
        </Button>
        <Button
          onClick={async () => {
            await send();
          }}
          variant="primary"
          centered
          className="px-10"
          size="lg"
        >
          Send
        </Button>
      </div>
    </div>
  );
};
