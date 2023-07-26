import React from "react";
import { FallingLines } from "react-loader-spinner";
const Spinner = ({ message }) => {
  return (
    <div className='flex items-center flex-col w-full'>
      <FallingLines color='red' width={200} height={200} />
      <p className='text-lg'>{message}</p>
    </div>
  );
};

export default Spinner;
