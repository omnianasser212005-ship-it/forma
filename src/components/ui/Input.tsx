import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: React.ReactNode;
  error?: string;
  hint?: string;
}

export const Input: React.FC<InputProps> = ({ label, error, hint, className = '', ...props }) => {
  return (
    <div className="w-full relative mb-4 text-start">
      <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">
        {label}
      </label>
      <input
        className={`w-full p-3.5 rounded-xl border-[1.5px] bg-gray-50/50 dark:bg-gray-800/50 text-black dark:text-white dark:border-white/10 outline-none transition-all duration-300 focus:bg-white dark:focus:bg-gray-800 ${
          error 
            ? 'border-red-500 focus:border-red-500 focus:ring-4 focus:ring-red-500/10' 
            : 'border-black/10 focus:border-[#C8A45D] focus:ring-4 focus:ring-[#C8A45D]/10'
        } ${className}`}
        {...props}
      />
      {error && <span className="text-[11px] text-red-500 mt-1.5 block animate-pulse">{error}</span>}
      {hint && !error && <span className="text-[11px] text-gray-500 mt-1 block">{hint}</span>}
    </div>
  );
};
