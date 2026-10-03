import React from 'react';

export const LoadingSpinner = ({ size = 'md' }) => {
  const sizeClasses = {
    sm: 'h-4 w-4 border-2',
    md: 'h-8 w-8 border-3',
    lg: 'h-12 w-12 border-4'
  };

  return (
    <div className="flex items-center justify-center">
      <div
        className={`${sizeClasses[size] || sizeClasses.md} animate-spin rounded-full border-indigo-500 border-t-transparent`}
      />
    </div>
  );
};