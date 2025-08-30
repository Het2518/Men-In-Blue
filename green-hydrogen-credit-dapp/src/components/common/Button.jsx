import React from 'react';

const Button = ({ children, className, ...props }) => {
  return (
    <button
      className={`bg-gradient-to-r from-hydrogen-cyan to-hydrogen-blue text-white font-semibold py-3 px-6 rounded-lg hover:from-hydrogen-blue hover:to-hydrogen-purple transition-all duration-300 animate-pulse shadow-neon ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
