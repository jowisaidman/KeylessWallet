import React, { FC, useRef, useEffect } from "react";
import DOMPurify from "dompurify";

export const AccountAvatar: FC<{ imageData: string }> = ({ imageData }) => {
  let container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (container.current != null) {
      container.current.innerHTML = DOMPurify.sanitize(imageData);
    }
  }, [imageData]);

  return (
    <div className="avatar">
      <div
        className="ring-primary ring-offset-base-100 w-24 rounded-full ring ring-offset-2"
        ref={container}
      ></div>
    </div>
  );
};

export default AccountAvatar;
