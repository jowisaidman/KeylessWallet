import React, { FC, forwardRef } from "react";

interface IInput {
  label: string;
  insideLabel?: string;
  placeholder: string;
}

export const Input = forwardRef<HTMLInputElement, IInput>((props, ref) => {
  const { label, placeholder, insideLabel } = props;
  return (
    <>
      <div className="label">
        <span className="label-text font-bold">{label}</span>
      </div>
      {
          insideLabel == null
          ? (
            <input
                type="text"
                placeholder={placeholder}
                ref={ref}
                className="input input-bordered w-full max-w-xs"
              />
          ) : (
          <label className="input input-bordered flex items-center gap-2">
              <input
                type="text"
                placeholder={placeholder}
                ref={ref}
                className="w-full max-w-xs"
              />
              { insideLabel }
            </label>
          )
      }
    </>
  );
});

export default Input;
