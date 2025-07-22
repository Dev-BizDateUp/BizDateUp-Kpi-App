import React from "react";

function FormYesNo({ name, defaultValue, onChangeValue, label }) {
  return (
    <div className="flex flex-col">
      {label}
      <div className="space-x-2 flex flex-row">
        <label className="flex items-center space-x-2">
          <input
            type="radio"
            name={name}
            value="yes"
            defaultChecked={defaultValue === true}
            onChange={() => onChangeValue(true)}
            className="text-indigo-600 focus:ring-indigo-500"
          />
          <span>Yes</span>
        </label>
        <label className="flex items-center space-x-2">
          <input
            type="radio"
            name={name}
            value="no"
            defaultChecked={defaultValue === false}
            onChange={() => onChangeValue(false)}
            className="text-indigo-600 focus:ring-indigo-500"
          />
          <span>No</span>
        </label>
      </div>
    </div>

  );
}

export default FormYesNo;
