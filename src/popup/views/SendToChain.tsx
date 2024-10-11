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
  TransactionItemDetail,
} from "../../utils/transaction";

export default () => {
  const transactionContext =
    useContext<ITransactionContext>(TransactionContext);
  const walletContext = useContext<IWalletContext>(WalletContext);

  const [transactionSent, setTransactionSent] = useState<boolean>(false);

  useEffect(() => {
    if (transactionContext.signedTransaction != null) {
      const decodedTx = Transaction.from(transactionContext.signedTransaction);

      const chainId = transactionContext.transaction.preview().chainId!;

      let detail: TransactionItemDetail = {
        to: transactionContext.transaction.preview().to!,
        value: transactionContext.transaction.preview().value!,
      };

      const transactionItem = new TransactionItemBuilder()
        .setHash(decodedTx.hash!)
        .setDate(Date.now())
        .setDirection("outgoing");

      sendToChain(transactionContext.signedTransaction)
        .then((receipt) => {
          if (receipt.error != null) {
            transactionItem.setStatus(TransactionItemStatus.Error);
            detail.error = receipt.error.message;
          } else {
            transactionItem.setStatus(TransactionItemStatus.Successful);
          }
          const txItem = transactionItem.setDetail(detail).build();

          addTransactionItem(txItem, chainId).then(() =>
            changeScreen(Screen.Welcome)
          );
        })
        .catch((e) => {
          console.log("there was an error sending the transaction", e);
          detail.error = "Unknown error";
          const txItem = transactionItem
            .setStatus(TransactionItemStatus.Error)
            .setDetail(detail)
            .build();

          addTransactionItem(txItem, chainId).then(() =>
            changeScreen(Screen.Welcome)
          );
        });
    } else {
      changeScreen(Screen.Welcome);
    }
  }, []);

  async function addTransactionItem(txItem: TransactionItem, chainId: number) {
    const currentAccount = walletContext.currentAccount!.address;
    return await updateState((currentState) => {
      if (currentState.transactionHistory[currentAccount] == null) {
        currentState.transactionHistory[currentAccount] = {
          [chainId]: [txItem],
        };
      } else if (
        currentState.transactionHistory[currentAccount][chainId] == null
      ) {
        currentState.transactionHistory[currentAccount][chainId] = [txItem];
      } else {
        currentState.transactionHistory[currentAccount][chainId].unshift(
          txItem
        );
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
