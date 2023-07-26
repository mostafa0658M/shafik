import React from "react";
import ErrorMessage from "./ErrorMessage";

const TextInput = ({ title, type = "text", register, error }) => {
  const inputProps = {
    id: title,
    required: true,
    className: [
      "text-input outline-none bg-gray-50 border border-gray-200 rounded-md focus:border-blue-500 transition-smooth p-3 focus:shadow-md peer w-full",
      type === "text-aria" && "h-20 overflow-hidden max-h-32 min-h-[5rem]",
    ].join(" "),
    ...register(title),
  };

  return (
    <div className='relative flex mt-4 w-full flex-col'>
      {type === "text" ? (
        <input type='text' {...inputProps} />
      ) : (
        <textarea {...inputProps}></textarea>
      )}
      <label
        htmlFor={title}
        className='absolute bg-slate-50 bg-clip-content transition-smooth text-base font-medium text-slate-400  capitalize p-3'
      >
        {title}
      </label>
      {error && <ErrorMessage error={error} />}
    </div>
  );
};

export default TextInput;
