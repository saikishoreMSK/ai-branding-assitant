
import React from "react";
import { cn } from "@/lib/utils";

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: boolean;
  padding?: "none" | "sm" | "md" | "lg";
}

const paddingMap = {
  none: "",
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
};

export const GlassCard = ({
  children,
  className,
  hoverEffect = true,
  padding = "md",
  ...props
}: GlassCardProps) => {
  return (
    <div
      className={cn(
        "glass rounded-xl transition-all duration-300",
        hoverEffect && "hover-glass hover-scale",
        padding && paddingMap[padding],
        "soft-shadow",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
