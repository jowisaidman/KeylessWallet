import { createContext } from "react";
import { Screen } from "../utils/navigation";

export type ITransactionContext = {
  data: string | null;
  setData: (data: string | null) => void;
};

export const DefaultTransactionContext: ITransactionContext = {
  data: null,
  setData: (d) => {},
};

export const TransactionContext = createContext<ITransactionContext>(
  DefaultTransactionContext
);
