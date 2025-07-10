"use client";

import React from "react";

interface SelectFieldProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  id: string;
  labelText: string;
  error?: string;
  classname?: string;
  placeholder?: string;
  options: { value: string | number; label: string }[];
}

const SelectField = React.forwardRef<HTMLSelectElement, SelectFieldProps>(
  ({ id, labelText, options, error, classname, placeholder, ...rest }, ref) => {
    return (
      <div className="flex flex-col justify-start w-full mt-[21px]">
        <label
          htmlFor={id}
          className={`text-[#343434] text-[15px] font-dm-sans font-normal tracking-[0.03em] w-full ${classname}`}
        >
          {labelText}
        </label>

        <select
          id={id}
          ref={ref}
          aria-placeholder="Select an option"
          className={`w-full border-b-[0.5px] border-b-gray-300 px-[12px] h-[42px] text-[#343434] text-[14px] font-dm-sans font-normal tracking-[0.03em] focus:border-[0.7px] focus:border-gray-400 appearance-none bg-transparent ${classname}`}
          {...rest}
        >
          {/* Placeholder option */}
          {placeholder && (
            <option value="" disabled selected={!rest.value} hidden>
              {placeholder}
            </option>
          )}
          {options.map((option, index) => (
            <option key={index} value={option.value} className="text-black">
              {option.label}
            </option>
          ))}
        </select>

        {error && <p className="text-red-500 text-sm">{error}</p>}
      </div>
    );
  }
);

SelectField.displayName = "SelectField";

export default SelectField;
