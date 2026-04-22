import React, { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  variant = 'primary', 
  isLoading, 
  children, 
  className = '',
  ...props 
}) => {
  const baseClasses = 'flex items-center justify-center font-bold outline-none transition-all duration-300 ease-in-out';
  
  const variants = {
    primary: 'bg-black text-white hover:bg-black/85 hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(0,0,0,0.25)] dark:bg-white dark:text-black dark:hover:bg-white/85 shadow-[0_4px_20px_rgba(0,0,0,0.2)] rounded-xl py-[15px] px-[36px]',
    secondary: 'bg-transparent text-black border-[1.5px] border-black/10 hover:border-black hover:bg-black/5 hover:-translate-y-0.5 dark:text-white dark:border-white/10 dark:hover:border-white dark:hover:bg-white/5 rounded-xl py-[15px] px-[28px]',
    outline: 'bg-transparent border border-gray-300 text-gray-700 hover:bg-gray-50'
  };

  const loadingClasses = isLoading ? 'opacity-70 cursor-not-allowed transform-none' : '';

  return (
    <button 
      className={`${baseClasses} ${variants[variant]} ${loadingClasses} ${className}`}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? (
        <span className="flex items-center gap-2">
          <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </span>
      ) : (
        children
      )}
    </button>
  );
};
