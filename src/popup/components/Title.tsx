import React, { FC } from "react";

export const Title: FC<{ title: string; subtitle?: string }> = ({
  title,
  subtitle,
}) => {
  return (
    <div className="text-center my-2">
      <div className="text-neutral font-bold text-3xl">{title}</div>
      {subtitle && (
        <div className="text-primary-content text-lg">{subtitle}</div>
      )}
    </div>
  );
};

export default Title;
