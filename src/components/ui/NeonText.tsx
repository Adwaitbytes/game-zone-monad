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
    primary: "text-glow-primary",
    secondary: "text-glow-secondary", 
    accent: "text-glow-accent",
    warning: "text-accent",
  };

  const baseClassName = cn(
    "font-bold tracking-tight",
    variants[variant],
    pulse && "pulse-soft",
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