import React from 'react';
import { motion } from 'framer-motion';

const LoadingSpinner = ({ 
  size = 'md', 
  color = 'orange', 
  fullScreen = false,
  message = '' 
}) => {
  const sizes = {
    sm: 'w-5 h-5',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  const colors = {
    orange: 'border-orange-500',
    blue: 'border-blue-500',
    green: 'border-green-500',
    white: 'border-white',
  };

  const spinnerClass = `${sizes[size]} border-4 border-t-transparent ${colors[color]} rounded-full`;

  const spinner = (
    <motion.div
      className={spinnerClass}
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
    />
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm">
        <div className="flex flex-col items-center gap-4">
          {spinner}
          {message && (
            <p className="text-gray-600 font-medium animate-pulse">{message}</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center p-4">
      <div className="flex flex-col items-center gap-2">
        {spinner}
        {message && (
          <p className="text-gray-500 text-sm">{message}</p>
        )}
      </div>
    </div>
  );
};

export default LoadingSpinner;
