import { cn } from "../../lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "healthy" | "recovering" | "sick" | "dormant" | "default";
  className?: string;
}

const variantStyles = {
  healthy: "bg-emerald-100 text-emerald-800",
  recovering: "bg-amber-100 text-amber-800",
  sick: "bg-red-100 text-red-800",
  dormant: "bg-slate-100 text-slate-600",
  default: "bg-cyan-50 text-cyan-700",
};

export function Badge({ children, variant = "default", className }: BadgeProps) {
  return (
    <span className={cn("inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium", variantStyles[variant], className)}>
      {children}
    </span>
  );
}
