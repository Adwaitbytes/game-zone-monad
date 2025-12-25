import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";
import { forwardRef, ReactNode } from "react";

interface GlowButtonProps extends Omit<HTMLMotionProps<"button">, "children"> {
  variant?: "primary" | "secondary" | "accent" | "danger" | "ghost";
  size?: "sm" | "md" | "lg" | "xl";
  glow?: boolean;
  pulse?: boolean;
  children?: ReactNode;
}

const GlowButton = forwardRef<HTMLButtonElement, GlowButtonProps>(
  ({ className, variant = "primary", size = "md", glow = true, pulse = false, children, disabled, ...props }, ref) => {
    const variants = {
      primary: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-neon-primary",
      secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/90 shadow-neon-secondary",
      accent: "bg-accent text-accent-foreground hover:bg-accent/90 shadow-neon-accent",
      danger: "bg-gradient-danger text-primary-foreground shadow-neon-primary",
      ghost: "bg-transparent text-foreground border border-border hover:bg-muted hover:border-primary/50",
    };

    const sizes = {
      sm: "px-3 py-1.5 text-xs rounded-md",
      md: "px-4 py-2 text-sm rounded-lg",
      lg: "px-6 py-3 text-base rounded-lg",
      xl: "px-8 py-4 text-lg rounded-xl",
    };

    return (
      <motion.button
        ref={ref}
        className={cn(
          "font-display font-semibold uppercase tracking-wider transition-all duration-300",
          "disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none",
          "relative overflow-hidden",
          variants[variant],
          sizes[size],
          glow && !disabled && "hover:shadow-glow-lg",
          pulse && !disabled && "animate-glow-pulse",
          className
        )}
        whileHover={disabled ? {} : { scale: 1.02 }}
        whileTap={disabled ? {} : { scale: 0.98 }}
        disabled={disabled}
        {...props}
      >
        {/* Shimmer overlay */}
        <span className="absolute inset-0 shimmer opacity-0 hover:opacity-100 transition-opacity duration-300" />
        
        {/* Content */}
        <span className="relative z-10 flex items-center justify-center gap-2">
          {children}
        </span>
      </motion.button>
    );
  }
);

GlowButton.displayName = "GlowButton";

export { GlowButton };
