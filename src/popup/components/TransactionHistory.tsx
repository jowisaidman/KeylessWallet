import React, { FC } from "react";
import { ethers } from "ethers";
import AccountLabel from "./AccountLabel";
import {
  TransactionItem,
  TransactionItemStatus,
} from "../../utils/transaction";

interface IWrappedRow {
  transaction: TransactionItem;
  explorerUrl: string;
  children: any;
}

export const WrappedRow: FC<IWrappedRow> = ({
  transaction,
  explorerUrl,
  children,
}) => {
  if (transaction.status === TransactionItemStatus.Successful) {
    return (
      <a href={explorerUrl.replace("<hash>", transaction.hash)}>{children}</a>
    );
  } else {
    return children;
  }
};

interface ITransactionHistory {
  transactions: TransactionItem[];
  explorerUrl: string;
}

export const TransactionHistory: FC<ITransactionHistory> = ({
  transactions,
  explorerUrl,
}) => {
  function getBadge(transaction: TransactionItem) {
    if (transaction.status !== TransactionItemStatus.Successful) {
      return <div className="badge badge-outline badge-success">Sent</div>;
    } else {
      return <div className="badge badge-outline badge-error">Error</div>;
    }
  }

  return (
    <table className="table">
      <tbody>
        {transactions.reverse().map((t) => (
          <WrappedRow transaction={t} explorerUrl={explorerUrl}>
            <tr>
              <td>
                <div className="mask mask-squircle bg-base-300 h-12 w-12 flex justify-center items-center">
                  <i className="ri-arrow-right-up-line font-bold text-3xl"></i>
                </div>
              </td>
              <td>
                <div>
                  {new Date(t.date).toLocaleDateString()}{" "}
                  {new Date(t.date).toLocaleTimeString()}
                </div>
                <AccountLabel account={t.detail.to} />
                <div className="font-bold text-lg">
                  {ethers.formatUnits(t.detail.value, "ether")} ETH
                </div>
              </td>
              <th>{getBadge(t)}</th>
            </tr>
          </WrappedRow>
        ))}
      </tbody>
    </table>
  );
};

export default TransactionHistory;
