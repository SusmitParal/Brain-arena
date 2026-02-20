import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'gold';
  size?: 'sm' | 'md' | 'lg';
  glow?: boolean;
}

const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  glow = false, // Deprecated in cartoon style, kept for interface compat
  className = '',
  ...props 
}) => {
  // Cartoon 3D Button Styles
  const baseStyles = "relative font-display font-bold uppercase tracking-wider transition-all duration-100 transform active:scale-95 active:translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed rounded-2xl border-b-4 border-r-2 shadow-lg flex items-center justify-center";
  
  const variants = {
    primary: "bg-blue-500 hover:bg-blue-400 text-white border-blue-700",
    secondary: "bg-slate-700 hover:bg-slate-600 text-white border-slate-900",
    danger: "bg-red-500 hover:bg-red-400 text-white border-red-700",
    gold: "bg-yellow-400 hover:bg-yellow-300 text-yellow-900 border-yellow-600",
  };

  const sizes = {
    sm: "px-4 py-2 text-xs min-h-[36px]",
    md: "px-6 py-3 text-sm min-h-[48px]",
    lg: "px-8 py-4 text-lg min-h-[60px]",
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;