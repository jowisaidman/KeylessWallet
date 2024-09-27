import React, { FC } from "react";

export const AccountLabel: FC<{
  label?: string;
  account: string;
  className?: string;
}> = ({ label, account, className }) => {
  return (
    <div
      className={`flex items-center tooltip tooltip-bottom break-words ${className}`}
      data-tip={account}
    >
      <h3 className="font-bold text-lg text-neutral">
        {label ||
          `${account.substring(0, 6)}...${account.substring(
            account.length - 4,
            account.length
          )}`}
      </h3>
      <i className="fa fa-eye mx-1"></i>
    </div>
  );
};

export default AccountLabel;
