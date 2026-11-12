import { ReactNode } from "react";
import { cn } from "@/lib/cn";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
}

export function Button({
  children,
  variant = "primary",
  size = "md",
  className,
  ...props
}: ButtonProps) {
  const baseStyles =
    "font-medium rounded-lg transition-colors focus-visible:outline-2 focus-visible:outline-offset-2";

  const variants = {
    primary:
      "bg-text text-bg hover:opacity-90 focus-visible:outline-text-secondary",
    secondary:
      "bg-surface text-text border border-border hover:bg-surface-2 focus-visible:outline-text-secondary",
    ghost:
      "text-text hover:bg-surface-2 focus-visible:outline-text-secondary",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
  };

  return (
    <button
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </button>
  );
}
