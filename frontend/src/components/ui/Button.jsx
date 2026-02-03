import React from 'react';
import { Loader2 } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  isLoading = false, 
  className, 
  ...props 
}) => {
  const variants = {
    primary: "bg-primary hover:bg-primary-dark text-white shadow-lg shadow-primary/30",
    secondary: "bg-secondary hover:bg-blue-600 text-white shadow-lg shadow-blue-500/30",
    outline: "border-2 border-primary text-primary hover:bg-primary/5 bg-transparent",
    ghost: "text-text-muted hover:text-primary hover:bg-primary/5 bg-transparent",
    danger: "bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/30"
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg"
  };

  return (
    <button 
      className={cn(
        "relative flex items-center justify-center rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-[0.98]",
        variants[variant],
        sizes[size],
        className
      )}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
      {children}
    </button>
  );
};

export default Button;
