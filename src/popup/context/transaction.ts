import { createContext } from "react";
import { Screen } from "../navigation";
import { Command } from "../../communication";
import { EIP1559TransactionBuilder } from "../../utils/transaction";

export type ITransactionContext = {
  // This transaction is created by our interface
  transaction: EIP1559TransactionBuilder;

  // This transaction is created and transmitted to us by a dapp
  dappTransactionEvent: Command | null;

  // Here we save the signed transaction, either by a dapp or the extension
  signedTransaction: string | null;
};

export const DefaultTransactionContext: ITransactionContext = {
  transaction: new EIP1559TransactionBuilder(),
  signedTransaction: null,
  dappTransactionEvent: null,
};

export const TransactionContext = createContext<ITransactionContext>(
  DefaultTransactionContext
);
