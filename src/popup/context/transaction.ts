import { createContext } from "react";
import { Screen } from "../navigation";
import { EIP1559TransactionBuilder } from "../../utils/transaction";

export type ITransactionContext = {
  transaction: EIP1559TransactionBuilder;
};

export const DefaultTransactionContext: ITransactionContext = {
  transaction: new EIP1559TransactionBuilder(),
};

export const TransactionContext = createContext<ITransactionContext>(
  DefaultTransactionContext
);
