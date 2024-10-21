import { createContext } from "react";
import { Screen } from "../navigation";
import { Command } from "../../communication";
import { EIP1559TransactionBuilder } from "../../utils/transaction";
import { ethers } from "ethers";

// TODO: Change name of this, this is not only for transaction but for everything that is "ephemeral"
export type ITransactionContext = {
  // This transaction is created by our interface
  transaction: EIP1559TransactionBuilder;

  // This transaction is created and transmitted to us by a dapp
  dappTransactionEvent: Command | null;

  // Here we save the signed transaction, either by a dapp or the extension
  signedTransaction: string | null;

  // Current balance for the current chain
  currentBalance: bigint;

  // Timestamp of the last time we fetched the balance
  lastTimeBalanceFetched: number | null;

  // Current chain provider
  rpcProvider: ethers.JsonRpcProvider | null;
};

export const DefaultTransactionContext: ITransactionContext = {
  transaction: new EIP1559TransactionBuilder(),
  signedTransaction: null,
  dappTransactionEvent: null,
  currentBalance: BigInt(0),
  lastTimeBalanceFetched: null,
  rpcProvider: null,
};

export const TransactionContext = createContext<ITransactionContext>(
  DefaultTransactionContext
);
