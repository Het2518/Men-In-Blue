import React from 'react';

const Input = ({ className, ...props }) => {
  return (
    <input
      className={`w-full p-3 border border-hydrogen-cyan rounded-lg bg-transparent text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-hydrogen-blue transition-all duration-300 ${className}`}
      {...props}
    />
  );
};

export default Input;
