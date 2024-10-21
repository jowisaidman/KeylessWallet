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
      <tr
        className="cursor-pointer"
        onClick={() =>
          window.open(explorerUrl.replace("<hash>", transaction.hash), "_blank")
        }
      >
        {children}
      </tr>
    );
  } else {
    return <tr>{children}</tr>;
  }
};

interface ITransactionHistory {
  transactions: TransactionItem[];
  chainUnit: string;
  explorerUrl: string;
}

export const TransactionHistory: FC<ITransactionHistory> = ({
  transactions,
  chainUnit,
  explorerUrl,
}) => (
  <table className="table">
    <tbody>
      {transactions.map((t) => (
        <WrappedRow transaction={t} explorerUrl={explorerUrl}>
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
              {ethers.formatUnits(t.detail.value, "ether")} {chainUnit}
            </div>
            {t.status === TransactionItemStatus.Error ? (
              <p>Error: {t.detail.error || "Unkwnown error"} </p>
            ) : (
              <></>
            )}
          </td>
          <th>
            {t.status === TransactionItemStatus.Successful ? (
              <div className="badge badge-outline badge-success">Sent</div>
            ) : (
              <div className="badge badge-outline badge-error">Error</div>
            )}
          </th>
        </WrappedRow>
      ))}
    </tbody>
  </table>
);

export default TransactionHistory;
