import React, { useEffect, useState, useContext } from "react";
import { Button } from "../components/Button";
import { Tabs, Tab } from "../components/Tabs";
import { WalletContext, IWalletContext } from "../context/context";
import {
  TransactionContext,
  ITransactionContext,
} from "../context/transaction";
import Title from "../components/Title";
import Loading from "../components/Loading";
import { changeScreen, Screen } from "../navigation";
import { getNextNonce } from "../transaction";
import ScreenContainer, { Footer } from "../components/ScreenContainer";
import QRCode from "qrcode";

export default () => {
  let [loadingQr, setLoadingQr] = useState(true);

  const walletContext = useContext<IWalletContext>(WalletContext);
  const transactionContext =
    useContext<ITransactionContext>(TransactionContext);

  useEffect(() => {
    if (transactionContext.transaction.preview().to != null) {
      buildQrToSing();
      setLoadingQr(false);
    } else {
      console.log("error");
      // go back to welcome screen and show a poopup saying that some error happened
    }
  }, []);

  async function back() {
    await changeScreen(Screen.SendReview);
  }

  async function send() {
    await changeScreen(Screen.QrToRead);
  }

  async function buildQrToSing() {
    const canvas = document.getElementById("qr");
    const nonce = await getNextNonce(walletContext.currentAccount!.address);
    transactionContext.transaction.setNonce(nonce);
    transactionContext.transaction.setMaxPriorityFeePerGas("882358428");
    transactionContext.transaction.setMaxFeePerGas("42874510220");
    transactionContext.transaction.setGasLimit("22000");
    transactionContext.transaction.setData("0x");

    console.log(JSON.stringify(transactionContext.transaction));
    const transaction = transactionContext.transaction.build();

    QRCode.toCanvas(canvas, JSON.stringify(transaction), function (error: any) {
      if (error) console.error(error);
      console.log("success!");
    });
  }

  return (
    <ScreenContainer>
      <Title title="Sign transaction" />
      <ul className="steps lg:steps-horizontal">
        <li className="step step-primary font-bold">Choose&#10;&#13;Account</li>
        <li className="step step-primary font-bold">Review</li>
        <li className="step step-primary font-bold">Sign</li>
        <li className="step">Send</li>
      </ul>
      <p className="text-neutral text-lg text-center">
        Scan the following QR code with the offline signer
      </p>
      <div className="skeleton h-[260px] w-[260px]">
        <canvas id="qr" className={loadingQr ? "hidden" : ""} />
      </div>

      <Footer>
        <Button onClick={back} className="px-10" centered>
          Back
        </Button>
        <Button
          onClick={send}
          variant="primary"
          centered
          className="px-10"
          disabled={loadingQr}
        >
          Send
        </Button>
      </Footer>
    </ScreenContainer>
  );
};
