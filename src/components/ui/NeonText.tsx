import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { ReactNode } from "react";

interface NeonTextProps {
  variant?: "primary" | "secondary" | "accent" | "warning";
  as?: "span" | "h1" | "h2" | "h3" | "h4" | "p";
  pulse?: boolean;
  className?: string;
  children?: ReactNode;
}

const NeonText = ({ 
  className, 
  variant = "primary", 
  as = "span",
  pulse = false,
  children, 
}: NeonTextProps) => {
  const variants = {
    primary: "text-neon-primary",
    secondary: "text-neon-secondary", 
    accent: "text-neon-accent",
    warning: "text-warning drop-shadow-[0_0_10px_hsl(var(--warning)/0.8)]",
  };

  const baseClassName = cn(
    "font-display font-bold",
    variants[variant],
    pulse && "pulse-glow",
    className
  );

  if (as === "h1") {
    return <motion.h1 className={baseClassName}>{children}</motion.h1>;
  }
  if (as === "h2") {
    return <motion.h2 className={baseClassName}>{children}</motion.h2>;
  }
  if (as === "h3") {
    return <motion.h3 className={baseClassName}>{children}</motion.h3>;
  }
  if (as === "h4") {
    return <motion.h4 className={baseClassName}>{children}</motion.h4>;
  }
  if (as === "p") {
    return <motion.p className={baseClassName}>{children}</motion.p>;
  }
  
  return <motion.span className={baseClassName}>{children}</motion.span>;
};

export { NeonText };
