import React, { FC } from "react";

export const AccountLabel: FC<{ label: string }> = ({ label }) => {
  return (
    <div
      className="flex items-center tooltip tooltip-bottom break-words"
      data-tip={label}
    >
      <h3 className="font-bold text-lg text-neutral">
        {label.substring(0, 6)}...
        {label.substring(label.length - 4, label.length)}
      </h3>
      <i className="fa fa-eye mx-1"></i>
    </div>
  );
};

export default AccountLabel;
