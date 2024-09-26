import React, { ButtonHTMLAttributes, FC, forwardRef } from "react";

export interface IButtonProperties
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  "data-testid"?: string;
  size?: "lg" | "sm" | "md";
  disabled?: boolean;
  variant?: "accent" | "primary" | "secondary" | "default";
  centered?: boolean;
}

export const Button: FC<IButtonProperties> = forwardRef<
  HTMLButtonElement,
  IButtonProperties
>(
  (
    {
      "data-testid": dataTestId,
      children,
      className,
      disabled,
      onClick,
      size = "md",
      type = "button",
      variant = "default",
      centered,
      ...rest
    },
    ref
  ) => {
    const variants = {
      parent: {
        accent: "btn-accent",
        primary: "btn-primary",
        secondary: "btn-secondary",
        default: "",
      },
      sizes: {
        sm: "btn-sm",
        lg: "btn-lg",
        md: "",
      },
    };
    return (
      <button
        disabled={disabled}
        onClick={onClick}
        type={type}
        ref={ref}
        className={[
          className,
          "btn",
          variants.parent[variant],
          variants.sizes[size],
        ].join(" ")}
        {...rest}
      >
        <span
          className={`flex items-center space-x-md transition-opacity text-base ${
            centered ? "justify-center" : ""
          }`}
        >
          <div className="flex items-center space-x-md font-semibold">
            {children}
          </div>
        </span>
      </button>
    );
  }
);

Button.displayName = "Button";
