import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";
import { forwardRef } from "react";

interface GlassCardProps extends HTMLMotionProps<"div"> {
  variant?: "default" | "elevated" | "primary" | "danger";
  hover?: boolean;
}

const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className, variant = "default", hover = false, children, ...props }, ref) => {
    const variants = {
      default: "glass",
      elevated: "glass-elevated",
      primary: "glass border-primary/20 shadow-glow-sm",
      danger: "glass border-secondary/20 shadow-glow-secondary",
    };

    return (
      <motion.div
        ref={ref}
        className={cn(
          "rounded-2xl p-5 transition-all duration-300",
          variants[variant],
          hover && "game-card cursor-pointer hover:border-primary/40",
          className
        )}
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);

GlassCard.displayName = "GlassCard";

export { GlassCard };