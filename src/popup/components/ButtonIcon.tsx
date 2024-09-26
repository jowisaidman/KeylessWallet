import React, { FC } from "react";

export const ButtonIcon: FC<{ icon: string; tooltip: string | undefined }> = ({
  icon,
  tooltip,
}) => {
  return (
    <div className="tooltip tooltip-bottom" data-tip={tooltip}>
      <button className="btn btn-circle btn-sm mx-1">
        <i className={`fa fa-${icon}`}></i>
      </button>
    </div>
  );
};

export default ButtonIcon;
