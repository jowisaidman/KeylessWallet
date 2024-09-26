import React, { FC, forwardRef } from "react";

interface IInput {
    label: string;
    placeholder: string
}

export const Input = forwardRef<HTMLInputElement, IInput>((props, ref) => {
    const { label, placeholder } = props;
  return (
    <>
      <div className="label">
        <span className="label-text font-bold">{label}</span>
      </div>
      <input
        type="text"
        placeholder={placeholder}
        ref={ref}
        className="input w-full max-w-xs"
      />
    </>
  );
});

export default Input;
