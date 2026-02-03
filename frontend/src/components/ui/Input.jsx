import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const Input = ({ 
  label, 
  id, 
  type = "text", 
  error, 
  className, 
  containerClassName,
  ...props 
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';

  return (
    <div className={cn("w-full", containerClassName)}>
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-text-primary mb-1.5 ml-1">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          id={id}
          type={isPassword ? (showPassword ? 'text' : 'password') : type}
          className={cn(
            "block w-full rounded-lg border-2 border-slate-200 bg-surface px-3 py-2 text-text-primary placeholder:text-text-muted/50 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all duration-200 outline-none",
            error && "border-red-500 focus:border-red-500 focus:ring-red-500/10",
            className
          )}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-primary transition-colors focus:outline-none"
          >
            {showPassword ? (
              <EyeOff className="h-5 w-5" />
            ) : (
              <Eye className="h-5 w-5" />
            )}
          </button>
        )}
      </div>
      {error && <p className="mt-1 text-sm text-red-500 ml-1">{error}</p>}
    </div>
  );
};

export default Input;
