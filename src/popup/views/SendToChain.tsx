import React, { useState, useEffect, useContext } from "react";
import {
  TransactionContext,
  ITransactionContext,
} from "../context/transaction";
import { WalletContext, IWalletContext } from "../context/context";
import { Button } from "../components/Button";
import { Tabs, Tab } from "../components/Tabs";
import Loading from "../components/Loading";
import { changeScreen, Screen, watchTransaction } from "../navigation";
import { sendToChain } from "../transaction";

export default () => {
  const transactionContext =
    useContext<ITransactionContext>(TransactionContext);
  const walletContext = useContext<IWalletContext>(WalletContext);

  const [transactionSent, setTransactionSent] = useState<boolean>(false);

  useEffect(() => {
    if (transactionContext.data != null) {
      sendToChain(transactionContext.data)
        .then(() => {
          console.log("success");
          setTransactionSent(true);
        })
        .catch((e) => {
          console.log(e);
          setTransactionSent(true);
        });
    }
  }, []);

  function ok() {
    transactionContext.setData(null);
    changeScreen(Screen.Welcome);
  }

  return (
    <div className="flex flex-col items-center gap-5 grow mt-5 pb-5 h-full justify-between">
      <div className="text-primary font-bold text-2xl my-2">
        Sending transaction to chain...
      </div>
      {transactionSent ? (
        <div className="text-center my-2">
          <div className="text-primary font-bold text-3xl">
            Transaction sent
          </div>

          <Button
            variant="secondary"
            size="lg"
            className="mt-3"
            onClick={() => {
              console.log(walletContext);
              watchTransaction(
                transactionContext.data,
                walletContext.network?.value
              );
            }}
          >
            View transaction
          </Button>
        </div>
      ) : (
        <Loading />
      )}
      <div className="flex items-center space-x-3 items-end mb-1">
        <Button
          onClick={ok}
          variant="primary"
          centered
          className="px-10"
          size="lg"
          //disabled={!transactionSent}
        >
          Done
        </Button>
      </div>
    </div>
  );
};
