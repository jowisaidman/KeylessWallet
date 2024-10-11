import React, { useState, useEffect, useContext } from "react";
import { Transaction } from "ethers";
import {
  TransactionContext,
  ITransactionContext,
} from "../context/transaction";
import { WalletContext, IWalletContext } from "../context/context";
import { Button } from "../components/Button";
import { Tabs, Tab } from "../components/Tabs";
import Loading from "../components/Loading";
import Title from "../components/Title";
import ScreenContainer, { Footer } from "../components/ScreenContainer";
import { changeScreen, Screen } from "../navigation";
import { sendToChain } from "../transaction";
import { updateState } from "../context/context";
import {
  TransactionItemBuilder,
  TransactionItemStatus,
  TransactionItem,
} from "../../utils/transaction";

export default () => {
  const transactionContext =
    useContext<ITransactionContext>(TransactionContext);
  const walletContext = useContext<IWalletContext>(WalletContext);

  const [transactionSent, setTransactionSent] = useState<boolean>(false);

  useEffect(() => {
    if (transactionContext.signedTransaction != null) {
      const decodedTx = Transaction.from(transactionContext.signedTransaction);

      const transactionItem = new TransactionItemBuilder()
        .setHash(decodedTx.hash!)
        .setDate(Date.now())
        .setDirection("outgoing")
        .setDetail({
          to: transactionContext.transaction.preview().to!,
          value: transactionContext.transaction.preview().value!,
        });

      sendToChain(transactionContext.signedTransaction)
        .then(() => {
          const txItem = transactionItem
            .setStatus(TransactionItemStatus.Successful)
            .build();

          addTransactionItem(txItem).then(() => changeScreen(Screen.Welcome));
        })
        .catch((e) => {
          console.log("there was an error sending the transaction", e);
          const txItem = transactionItem
            .setStatus(TransactionItemStatus.Error)
            .build();

          addTransactionItem(txItem).then(() => changeScreen(Screen.Welcome));
        });
    } else {
      changeScreen(Screen.Welcome);
    }
  }, []);

  async function addTransactionItem(txItem: TransactionItem) {
    const currentAccount = walletContext.currentAccount!.address;
    return await updateState((currentState) => {
      if (currentState.transactionHistory[currentAccount] == null) {
        currentState.transactionHistory[currentAccount] = [txItem];
      } else {
        currentState.transactionHistory[currentAccount].push(txItem);
      }
      return currentState;
    });
  }

  function ok() {
    changeScreen(Screen.Welcome);
  }

  return (
    <ScreenContainer>
      <Title title="Sending transaction to chain..." />
      <Loading />
      <Footer>
        <Button onClick={ok} variant="primary" centered className="px-10">
          Go home
        </Button>
      </Footer>
    </ScreenContainer>
  );
};
