import React, { FC } from "react";

interface IEmptyState {
  icon: string;

  text: string;

  subtext?: string;

  actionText?: string;

  onClickAction?: () => any;
}

export const EmptyState: FC<IEmptyState> = ({
  icon,
  text,
  subtext,
  actionText,
  onClickAction,
}) => (
  <div className="flex flex-col justify-center items-center">
    <i className={`ri-${icon} text-6xl text-secondary`}></i>
    <div className="text-neutral font-bold text-2xl">{text}</div>
    {subtext && (
      <div className="text-primary-content text-center text-lg">{subtext}</div>
    )}
    {actionText && (
      <button
        className="btn btn-link text-accent text-lg no-underline"
        onClick={onClickAction}
      >
        {actionText}
      </button>
    )}
  </div>
);

export default EmptyState;
