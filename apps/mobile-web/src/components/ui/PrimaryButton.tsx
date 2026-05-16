"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";

type PrimaryButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  fullWidth?: boolean;
  variant?: "solid" | "light";
};

export function PrimaryButton({
  children,
  className = "",
  fullWidth = false,
  variant = "solid",
  ...props
}: PrimaryButtonProps) {
  const widthClass = fullWidth ? "w-full" : "w-[360px]";
  const variantClass =
    variant === "solid"
      ? "bg-[#2d6a2d] text-white"
      : "bg-white text-[#2d6a2d]";

  return (
    <button
      type="button"
      className={`flex h-[57px] items-center justify-center rounded-[10px] px-2.5 py-[15px] text-center text-[18px] font-bold leading-[27px] transition-transform duration-200 hover:scale-[0.99] active:scale-[0.98] ${widthClass} ${variantClass} ${className}`.trim()}
      {...props}
    >
      {children}
    </button>
  );
}
