import React from 'react';

const LoadingSpinner = ({ size = 'md', text = 'Loading...', className = '' }) => {
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-12 w-12',
    lg: 'h-16 w-16',
    xl: 'h-24 w-24'
  };

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div
        className={`animate-spin rounded-full border-b-2 border-hydrogen-cyan ${sizeClasses[size]} mb-4`}
        style={{
          borderTopColor: 'transparent',
          borderRightColor: 'transparent',
          borderLeftColor: 'transparent'
        }}
      ></div>
      <p className="text-white text-lg font-medium">{text}</p>
    </div>
  );
};

export default LoadingSpinner;
