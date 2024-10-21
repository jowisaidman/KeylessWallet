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
import { getNextNonce, estimateGasFee } from "../../utils/transaction";
import ScreenContainer, { Footer } from "../components/ScreenContainer";
import QRCode from "qrcode";

export default () => {
  const walletContext = useContext<IWalletContext>(WalletContext);
  const ephemeralContext =
    useContext<ITransactionContext>(TransactionContext);

  let [dataToSign, setDataToSign] = useState<string | null>(null);
  let [dataTooLong, setDataTooLong] = useState<boolean>(false);

  useEffect(() => {
    if (ephemeralContext.transaction.preview().to != null) {
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
    await changeScreen(Screen.QrToRead);
  }

  async function buildQrToSing() {
    const nonce = await getNextNonce(walletContext.currentAccount!.address, ephemeralContext.rpcProvider!);
    ephemeralContext.transaction.setNonce(nonce);
    const transaction = ephemeralContext.transaction.build();
    const message = btoa(JSON.stringify(transaction));

    const data = JSON.stringify({ part: 1, totalParts: 1, message });
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
        <li className="step step-primary font-bold">Choose&#10;&#13;Account</li>
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
