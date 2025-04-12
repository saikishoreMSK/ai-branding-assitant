
import React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface AnimatedButtonProps extends React.ComponentProps<typeof Button> {
  children: React.ReactNode;
  className?: string;
  hoverScale?: boolean;
  glowEffect?: boolean;
}

export const AnimatedButton = ({
  children,
  className,
  hoverScale = true,
  glowEffect = false,
  ...props
}: AnimatedButtonProps) => {
  return (
    <Button
      className={cn(
        "relative overflow-hidden transition-all duration-300",
        hoverScale && "hover:scale-[1.03] active:scale-[0.97]",
        glowEffect && "hover:shadow-[0_0_15px_rgba(59,130,246,0.5)]",
        className
      )}
      {...props}
    >
      <span className="relative z-10">{children}</span>
      {glowEffect && (
        <span className="absolute inset-0 bg-gradient-to-r from-primary/10 to-primary/0 opacity-0 hover:opacity-100 transition-opacity duration-300"></span>
      )}
    </Button>
  );
};
