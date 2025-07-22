import React from "react";

function FormDropdown({ options = [], defaultValue, onChangeValue, placeholder }) {
    return (
        <>
            <label>
                {placeholder}
            </label>
            <select
                defaultValue={defaultValue}
                onChange={(e) => onChangeValue(e.target.value)}
                className="px-3 m-2 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
                <option value="" disabled>
                    Select an option
                </option>
                {options.map((opt, index) => (
                    <option key={index} value={opt.id}>
                        {opt.name}
                    </option>
                ))}
            </select>
        </>

    );
}

export default FormDropdown;
