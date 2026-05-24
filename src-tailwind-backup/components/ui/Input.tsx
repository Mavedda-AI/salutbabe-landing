import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({ label, error, className = '', ...props }) => {
  return (
    <div className="w-full space-y-2">
      {label && (
        <label className="block text-sm font-bold text-primary/80 ml-1">
          {label}
        </label>
      )}
      <input
        className={`
          w-full px-5 py-4 rounded-2xl bg-white border-2 border-transparent
          focus:border-secondary focus:outline-none transition-all
          placeholder:text-gray-400 text-brand-text shadow-sm
          ${error ? 'border-red-400' : ''}
          ${className}
        `}
        {...props}
      />
      {error && <p className="text-xs text-red-500 font-medium ml-1">{error}</p>}
    </div>
  );
};
