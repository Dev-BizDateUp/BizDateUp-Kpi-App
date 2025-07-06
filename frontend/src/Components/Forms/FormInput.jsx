import React from "react";

function FormInput({ type = 'text', defaultText, onChangeText, hint, label = true, px = 3, register = _ => { }, form_name, required }) {
    return (
        <>

            {
                label &&
                <label>{hint}</label>
            }
            <input
                type={type}
                defaultValue={defaultText}
                onChange={(e) => onChangeText(e.target.value)}
                placeholder={hint}
                className={`px-${px} py-2 m-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500`}
            />
        </>
    );
}

export default FormInput;
