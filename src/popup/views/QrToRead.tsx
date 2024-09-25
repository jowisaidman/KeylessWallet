import React, { useContext } from "react";
import { Button } from "../components/Button";
import {
  TransactionContext,
  ITransactionContext,
} from "../context/transaction";
import { QrReader } from "../components/QrReader";
import { changeScreen, Screen } from "../navigation";

export default () => {
  const transactionContext =
    useContext<ITransactionContext>(TransactionContext);

  async function cancel() {
    await changeScreen(Screen.Welcome);
  }

  function onScanSignature(signedTx: string) {
    transactionContext.setData(signedTx);
    changeScreen(Screen.SendToChain);
  }

  return (
    <div className="flex flex-col items-center gap-5 grow pb-5 h-full justify-between">
      <div className="text-center my-2">
        <div className="text-primary font-bold text-2xl">
          Scan the signed transaction
        </div>
        <div className="text-secondary">
          Scan the QR code showed in the offline wallet to send the transaction
          to chain
        </div>
      </div>

      <QrReader readInterval={500} onSuccess={onScanSignature} />

      <div className="flex items-center space-x-3 items-end mb-1">
        <Button
          onClick={cancel}
          variant="primary"
          centered
          className="px-10"
          size="lg"
        >
          Cancel
        </Button>
      </div>
    </div>
  );
};
