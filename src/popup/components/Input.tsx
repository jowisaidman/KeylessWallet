import React, { FC, forwardRef } from "react";

interface IInput {
  label: string;
  insideLabel?: string;
  placeholder?: string;
  defaultValue?: string;
  disabled?: boolean;
  className?: string;
}

export const Input = forwardRef<HTMLInputElement, IInput>((props, ref) => {
  const {
    label,
    placeholder,
    insideLabel,
    defaultValue,
    disabled = false,
    className,
  } = props;
  return (
    <>
      <div className="label">
        <span className="label-text font-bold">{label}</span>
      </div>
      {insideLabel == null ? (
        <input
          type="text"
          placeholder={placeholder}
          ref={ref}
          defaultValue={defaultValue}
          className={`input input-bordered w-full max-w-xs ${className}`}
          disabled={disabled}
        />
      ) : (
        <label className="input input-bordered flex items-center gap-2">
          <input
            type="text"
            placeholder={placeholder}
            ref={ref}
            defaultValue={defaultValue}
            className={`w-full max-w-xs ${className}`}
            disabled={disabled}
          />
          <span className="text-neutral">{insideLabel}</span>
        </label>
      )}
    </>
  );
});

export default Input;
