import React from "react";

const ErrorMessage = ({ error }) => (
  <p className='mb-1 text-red-500'>{error?.message && error.message}</p>
);

export default ErrorMessage;
