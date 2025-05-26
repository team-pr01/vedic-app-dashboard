/* eslint-disable @typescript-eslint/no-explicit-any */
import { forwardRef } from "react";
import { FieldError, FieldErrorsImpl, Merge } from "react-hook-form";

interface DropdownProps {
  label: string;
  options: string[];
  error?: FieldError | Merge<FieldError, FieldErrorsImpl<any>>;
  isRequired?: boolean;
  selected?: boolean;
}

const SelectDropdown = forwardRef<HTMLSelectElement, DropdownProps>(
  ({ label, options, error, isRequired = true, selected, ...rest }, ref) => {
    return (
      <div className="flex flex-col gap-2 font-Inter">
        <label className="text-neutral-65">
          {label}
          {isRequired && <span className="text-red-600">*</span>}
        </label>
        <select
          ref={ref}
          defaultChecked={selected}
          required={isRequired}
          className={`px-[18px] py-[14px] rounded-lg bg-neutral-70 border text-neutral-65 focus:outline-none focus:border-primary-10 transition duration-300 ${
            error ? "border-red-500" : "border-neutral-75"
          }`}
          {...rest}
        >
          <option value="" disabled selected className="capitalize">
            Select {label}
          </option>
          {options.map((option, index) => (
            <option key={index} value={option} className="capitalize">
              {option}
            </option>
          ))}
        </select>
        {error && typeof error.message === "string" && (
          <p className="text-xs text-red-500 mt-1">{error.message}</p>
        )}
      </div>
    );
  }
);

SelectDropdown.displayName = "SelectDropdown";

export default SelectDropdown;
