import React, { FC } from "react";

export interface IScreenContainerProperties {
  children: any;
}

export const ScreenContainer: FC<IScreenContainerProperties> = ({
  children,
}) => {
  return (
    <div className="flex flex-col items-center gap-5 grow p-5 h-full justify-between">
      {children}
    </div>
  );
};

export interface IFooterProperties {
  children: any;
}

export const Footer: FC<IFooterProperties> = ({ children }) => {
  return (
    <div className="flex items-center space-x-3 items-end mt-auto">
      {children}
    </div>
  );
};

export default ScreenContainer;
