import React, { useContext } from "react";
import { Button } from "../components/Button";
import {
  TransactionContext,
  ITransactionContext,
} from "../context/transaction";
import { QrReader } from "../components/QrReader";
import ScreenContainer, { Footer } from "../components/ScreenContainer";
import Title from "../components/Title";
import { changeScreen, Screen } from "../navigation";

export default () => {
  const transactionContext =
    useContext<ITransactionContext>(TransactionContext);

  async function cancel() {
    await changeScreen(Screen.Welcome);
  }

  function onScanSignature(signedTx: string) {
    transactionContext.signedTransaction = signedTx;
    changeScreen(Screen.SendToChain);
  }

  return (
    <ScreenContainer>
      <Title title="Scan the signed transaction" />

      <ul className="steps lg:steps-horizontal">
        <li className="step step-primary font-bold">Choose&#10;&#13;Account</li>
        <li className="step step-primary font-bold">Review</li>
        <li className="step step-primary font-bold">Sign</li>
        <li className="step step-primary font-bold">Send</li>
      </ul>

      <p className="text-neutral text-lg text-center">
        Scan the QR code showed in the offline wallet to send the transaction to
        chain
      </p>
      <QrReader readInterval={500} onSuccess={onScanSignature} />

      <Footer>
        <Button onClick={cancel} centered>
          Cancel
        </Button>
      </Footer>
    </ScreenContainer>
  );
};
