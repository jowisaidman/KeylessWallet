import React, { FC } from "react";

interface IButtonIcon {
  icon: string;
  tooltip?: string;
  label?: string;
  size?: "lg" | "md" | "sm" | "xs";
  variant?: "accent" | "primary" | "secondary" | "default";
  onClick?: (...args: any[]) => any;
}

const variants = {
  variant: {
    accent: "btn-accent",
    primary: "btn-primary",
    secondary: "btn-secondary",
    default: "",
  },
  sizes: {
    xs: "btn-xs",
    sm: "btn-sm",
    lg: "btn-lg",
    md: "",
  },
  textSizes: {
    xs: "text-sm",
    sm: "text-base",
    md: "text-lg",
    lg: "text-xl",
  },
};

export const ButtonIcon: FC<IButtonIcon> = ({
  icon,
  tooltip,
  label,
  size = "md",
  variant = "default",
  onClick,
}) => {
  return (
    <div
      className="flex flex-col items-center tooltip tooltip-bottom"
      data-tip={tooltip}
    >
      <button
        className={`btn btn-circle m-1 ${variants.variant[variant]} ${variants.sizes[size]}`}
        onClick={onClick}
      >
        <i className={`ri-${icon} ${variants.textSizes[size]}`}></i>
      </button>
      {label && <span>{label}</span>}
    </div>
  );
};

export default ButtonIcon;
