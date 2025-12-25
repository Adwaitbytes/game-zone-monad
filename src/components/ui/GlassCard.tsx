import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";
import { forwardRef } from "react";

interface GlassCardProps extends HTMLMotionProps<"div"> {
  variant?: "default" | "elevated" | "danger" | "success";
  glow?: boolean;
  hover?: boolean;
}

const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className, variant = "default", glow = false, hover = true, children, ...props }, ref) => {
    const variants = {
      default: "glass border-border/30",
      elevated: "glass-elevated border-border/20",
      danger: "glass border-primary/30 shadow-neon-primary",
      success: "glass border-secondary/30 shadow-neon-secondary",
    };

    return (
      <motion.div
        ref={ref}
        className={cn(
          "rounded-xl p-4 transition-all duration-300",
          variants[variant],
          glow && "animate-glow-pulse",
          hover && "hover:border-primary/50 hover:shadow-neon-primary",
          className
        )}
        initial={{ opacity: 0, y: 20 }}
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
