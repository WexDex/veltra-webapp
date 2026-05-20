import { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  padding?: boolean;
}

export default function Card({
  children,
  className,
  padding = true,
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        "bg-gray-900 border border-gray-800 rounded-2xl",
        padding && "p-6",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
