import { createContext } from "react";
import { Screen } from "../navigation";
import { EIP1559TransactionBuilder } from "../../utils/transaction";

export type ITransactionContext = {
  transaction: EIP1559TransactionBuilder;
  signedTransaction: string | null;
};

export const DefaultTransactionContext: ITransactionContext = {
  transaction: new EIP1559TransactionBuilder(),
  signedTransaction: null,
};

export const TransactionContext = createContext<ITransactionContext>(
  DefaultTransactionContext
);
