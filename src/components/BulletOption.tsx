import React, { FC, PropsWithChildren } from "react";
import { Tooltip } from "react-tooltip";

export enum EBulletModes {
  "success" = "success",
  "failure" = "failure",
  "warn" = "warn",
  "info" = "info",
}

const modeToIcon: { [x in EBulletModes]: string } = {
  success: "shield-tick",
  failure: "shield-cross",
  warn: "shield-warning",
  info: "check-circle",
};

const BulletOption: FC<
  PropsWithChildren<{
    mode: EBulletModes;
    isUnknown: boolean;
    tooltipId: string;
    tooltipContent: string;
  }>
> = ({ children, mode, isUnknown, tooltipId, tooltipContent }) => {
  return (
    <div className="flex mt-2 items-center flex-1">
      <img src={`/${modeToIcon[mode]}.svg`} alt={`${mode} icon`} />
      <div
        className={`${
          mode === EBulletModes.failure ? "text-secondary/[.8]" : "text-default"
        } flex items-center ml-1`}
      >
        <div style={{ textAlign: "start" }}>{children}</div>
        {isUnknown ? null : (
          <>
            <img
              src="/helper.svg"
              alt="Helper icon"
              data-tooltip-id={tooltipId}
              data-tooltip-content={tooltipContent}
            />
            {tooltipId && (
              <Tooltip
                id={tooltipId}
                style={{ textAlign: "start", maxWidth: "200px" }}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default BulletOption;
