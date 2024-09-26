import React, { FC } from "react";

export const Title: FC<{ title: string; subtitle: string | undefined }> = ({
  title,
  subtitle,
}) => {
  return (
    <div className="text-center my-2">
      <div className="text-neutral font-bold text-3xl">{title}</div>
      {subtitle != null ? (
        <div className="text-primary-content text-lg">{subtitle}</div>
      ) : null}
    </div>
  );
};

export default Title;
