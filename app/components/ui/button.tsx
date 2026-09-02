import * as React from "react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "ghost" | "outline";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = "", variant = "default", ...props }, ref) => {
    let variantStyles = "bg-slate-900 text-white hover:bg-slate-800";
    if (variant === "ghost") {
      variantStyles = "bg-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-100";
    } else if (variant === "outline") {
      variantStyles = "border border-slate-300 bg-transparent hover:bg-slate-100 text-slate-800";
    }

    return (
      <button
        ref={ref}
        className={`inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2 ${variantStyles} ${className}`}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";