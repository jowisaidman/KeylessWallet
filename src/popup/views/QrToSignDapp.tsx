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
import EmptyState from "../components/EmptyState";
import Qr from "../components/Qr";
import { changeScreen, Screen } from "../navigation";
import { getNextNonce } from "../transaction";
import { estimateGasFee } from "../../utils/transaction";
import ScreenContainer, { Footer } from "../components/ScreenContainer";
import QRCode from "qrcode";

export default () => {
  const walletContext = useContext<IWalletContext>(WalletContext);
  const transactionContext =
    useContext<ITransactionContext>(TransactionContext);

  let [dataToSign, setDataToSign] = useState<string | null>(null);
  let [dataTooLong, setDataTooLong] = useState<boolean>(false);

  useEffect(() => {
    if (transactionContext.dappTransactionEvent != null) {
      buildQrToSing();
    } else {
      console.log("error");
      // go back to welcome screen and show a poopup saying that some error happened
    }
  }, []);

  async function back() {
    await changeScreen(Screen.SendReview);
  }

  async function send() {
    await changeScreen(Screen.QrToReadDapp);
  }

  async function buildQrToSing() {
    const canvas = document.getElementById("qr");
    const nonce = await getNextNonce(walletContext.currentAccount!.address);
    transactionContext.dappTransactionEvent!.data[0].nonce = nonce;

    const message = btoa(
      JSON.stringify(transactionContext.dappTransactionEvent!.data[0])
    );
    const data = JSON.stringify({ part: 1, totalParts: 1, message });

    console.log(data.length);
    if (data.length > 400) {
      setDataTooLong(true);
    } else {
      setDataToSign(data);
    }
  }

  return (
    <ScreenContainer>
      <Title title="Sign transaction" />
      <ul className="steps lg:steps-horizontal">
        <li className="step step-primary font-bold">Review</li>
        <li className="step step-primary font-bold">Sign</li>
        <li className="step">Send</li>
      </ul>
      <p className="text-neutral text-lg text-center">
        Scan the following QR code with the offline signer
      </p>
      {!dataTooLong ? (
        <Qr data={dataToSign} />
      ) : (
        <EmptyState
          icon="error-warning-line"
          text="Data to sign is too long"
          subtext="The data to be signed is too long and must be divided. This feature will be available soon."
          className="p-6"
        />
      )}
      <Footer>
        <Button onClick={back} className="px-10" centered>
          Back
        </Button>
        <Button
          onClick={send}
          variant="primary"
          centered
          className="px-10"
          disabled={dataToSign == null || dataTooLong}
        >
          Send
        </Button>
      </Footer>
    </ScreenContainer>
  );
};
