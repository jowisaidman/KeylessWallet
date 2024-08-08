import React, { ButtonHTMLAttributes, FC, forwardRef } from "react";

export interface IButtonProperties
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  "data-testid"?: string;
  size?: "lg" | "sm";
  disabled?: boolean;
  variant?: "primary" | "secondary";
  centered?: boolean;
  label: string;
}

export const LabelledButton: FC<IButtonProperties> = forwardRef<
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
      size = "sm",
      type = "button",
      variant = "primary",
      centered,
      label,
      ...rest
    },
    ref
  ) => {
    const variants = {
      parent: {
        primary:
          "active:outline-accent-hover-action outline-none bg-highlight text-on-highlight hover:bg-highlight/[.6]",
        secondary:
          "outline-default outline-width-[0.5px] bg-transparent outline-1 text-default hover:bg-white/[.1] active:outline-highlight",
      },
      sizes: {
        sm: "px-3 py-1",
        lg: "px-3 py-3",
      },
    };
    return (
      <div className={`flex flex-col items-center`}>
        <button
          data-testid={dataTestId}
          disabled={disabled}
          onClick={onClick}
          type={type}
          ref={ref}
          className={[
            className,
            "rounded-full active:outline-1 leading-snug transition-all text-base outline disabled:cursor-not-allowed !disabled:outline-none",
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
        <span>{label}</span>
      </div>
    );
  }
);

LabelledButton.displayName = "LabelledButton";
