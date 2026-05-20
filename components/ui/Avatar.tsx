import { cn } from "@/lib/utils";

interface AvatarProps {
  name: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizes = {
  sm: "w-8 h-8 text-xs",
  md: "w-10 h-10 text-sm",
  lg: "w-12 h-12 text-base",
};

const colors = [
  "bg-blue-700",
  "bg-purple-700",
  "bg-green-700",
  "bg-orange-700",
  "bg-pink-700",
];

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function getColor(name: string) {
  return colors[name.charCodeAt(0) % colors.length];
}

export default function Avatar({ name, size = "md", className }: AvatarProps) {
  return (
    <div
      className={cn(
        sizes[size],
        getColor(name),
        "rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0",
        className
      )}
    >
      {getInitials(name)}
    </div>
  );
}
