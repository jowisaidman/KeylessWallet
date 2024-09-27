import React, { FC, useRef, useEffect } from "react";
import DOMPurify from "dompurify";

interface IAccountAvatar {
  imageData: string;
  className?: string;
  size?: "md" | "lg";
}

const variants = {
  sizes: {
    md: "w-6",
    lg: "w-12",
  },
};

export const AccountAvatar: FC<IAccountAvatar> = ({ imageData, className, size = "lg" }) => {
  let container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (container.current != null) {
      container.current.innerHTML = DOMPurify.sanitize(imageData);
    }
  }, [imageData]);

  return (
    <div className={`avatar ${className || ""}`}>
      <div
        className={`ring-primary ring-offset-base-100 ${variants.sizes[size]} rounded-full ring ring-offset-2`}
        ref={container}
      ></div>
    </div>
  );
};

export default AccountAvatar;
