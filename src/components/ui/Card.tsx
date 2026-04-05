import { cn } from "../../lib/utils";
import type { HTMLAttributes } from "react";

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200/60 shadow-sm", className)}
      {...props}
    />
  );
}
