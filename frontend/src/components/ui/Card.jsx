import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const Card = ({ children, className, ...props }) => {
  return (
    <div 
      className={cn(
        "bg-white/70 backdrop-blur-xl border border-white/20 shadow-xl rounded-2xl overflow-hidden",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
