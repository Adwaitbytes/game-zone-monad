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
      primary: "bg-gradient-primary text-primary-foreground shadow-glow",
      secondary: "bg-gradient-danger text-secondary-foreground shadow-glow-secondary",
      accent: "bg-gradient-gold text-accent-foreground shadow-glow-accent",
      danger: "bg-gradient-danger text-white shadow-glow-secondary",
      ghost: "bg-transparent text-foreground border border-border hover:bg-muted/50 hover:border-primary/30",
    };

    const sizes = {
      sm: "px-3 py-1.5 text-xs rounded-lg",
      md: "px-4 py-2 text-sm rounded-lg",
      lg: "px-6 py-3 text-base rounded-xl",
      xl: "px-8 py-4 text-lg rounded-xl",
    };

    return (
      <motion.button
        ref={ref}
        className={cn(
          "font-semibold tracking-wide transition-all duration-200",
          "disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none",
          "relative overflow-hidden",
          variants[variant],
          sizes[size],
          glow && !disabled && "hover:shadow-glow-lg",
          pulse && !disabled && "animate-glow-pulse",
          className
        )}
        whileHover={disabled ? {} : { scale: 1.02, y: -1 }}
        whileTap={disabled ? {} : { scale: 0.98 }}
        disabled={disabled}
        {...props}
      >
        {/* Shimmer overlay */}
        <span className="absolute inset-0 shimmer opacity-0 hover:opacity-100 transition-opacity duration-500" />
        
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