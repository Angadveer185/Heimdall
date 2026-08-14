"use client";

import React from "react";
import { motion, HTMLMotionProps } from "framer-motion";

export type ButtonVariant = "primary" | "secondary" | "inverted" | "outline";

// We combine standard button attributes with motion component props
type OmittedHTMLProps = Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, keyof HTMLMotionProps<"button">>;
interface ButtonProps extends OmittedHTMLProps, Omit<HTMLMotionProps<"button">, "children"> {
  variant?: ButtonVariant;
  children: React.ReactNode;
}

export function Button({
  variant = "primary",
  children,
  className = "",
  ...props
}: ButtonProps) {
  const baseStyles = "px-8 py-3.5 rounded-md font-medium text-base transition-colors duration-250 cursor-pointer flex items-center justify-center select-none";
  
  const variantStyles = {
    primary: "bg-color-neutral text-color-primary hover:bg-color-bg/70 active:bg-color-bg",
    secondary: "bg-color-secondary text-white hover:bg-color-secondary/90 active:bg-color-secondary/80",
    inverted: "bg-color-primary text-color-bg hover:opacity-90",
    outline: "border-2 border-color-primary bg-transparent text-color-primary hover:bg-color-primary/10",
  };

  return (
    <motion.button
      whileHover={{ scale: 1.03, y: -1 }}
      whileTap={{ scale: 0.97, y: 0 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
}
