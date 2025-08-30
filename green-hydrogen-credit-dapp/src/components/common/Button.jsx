import React from 'react';

const Button = ({ children, className = '', variant = 'primary', size = 'md', ...props }) => {
  const baseClasses = 'font-semibold rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-hydrogen-cyan/50';

  const variants = {
    primary: 'bg-gradient-to-r from-hydrogen-cyan to-hydrogen-blue text-white hover:from-hydrogen-blue hover:to-hydrogen-purple shadow-neon',
    outline: 'border-2 border-hydrogen-cyan text-hydrogen-cyan hover:bg-hydrogen-cyan hover:text-hydrogen-dark',
    secondary: 'bg-hydrogen-dark text-white border border-hydrogen-cyan/30 hover:border-hydrogen-cyan/60',
    danger: 'bg-red-600 text-white hover:bg-red-700'
  };

  const sizes = {
    sm: 'py-2 px-4 text-sm',
    md: 'py-3 px-6',
    lg: 'py-4 px-8 text-lg'
  };

  const classes = `${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`;

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
};

export default Button;
