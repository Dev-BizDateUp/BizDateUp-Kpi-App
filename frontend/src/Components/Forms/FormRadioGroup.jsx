import React from "react";

function FormRadioGroup({ name, options = [], defaultValue, onChangeValue }) {
  return (
    <div className="space-y-2">
      {options.map((opt, index) => (
        <label key={index} className="flex items-center space-x-2">
          <input
            type="radio"
            name={name}
            value={opt.value}
            defaultChecked={opt.value === defaultValue}
            onChange={(e) => onChangeValue(e.target.value)}
            className="text-indigo-600 focus:ring-indigo-500"
          />
          <span>{opt.label}</span>
        </label>
      ))}
    </div>
  );
}

export default FormRadioGroup;
