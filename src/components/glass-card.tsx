import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type Variant = "subtle" | "default" | "strong";

interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: Variant;
  noise?: boolean;
  glow?: boolean;
  as?: keyof HTMLElementTagNameMap;
}

export const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(function GlassCard(
  { className, variant = "default", noise = false, glow = false, children, ...rest },
  ref,
) {
  const v =
    variant === "strong"
      ? "card-glass-strong"
      : variant === "subtle"
        ? "card-glass-subtle"
        : "card-glass";

  return (
    <div
      ref={ref}
      className={cn(
        "glass-card relative overflow-hidden rounded-2xl",
        v,
        noise && "noise",
        className,
      )}
      {...rest}
    >
      {glow && (
        <div
          aria-hidden
          className="pointer-events-none absolute -top-1/2 left-1/2 h-[120%] w-[80%] -translate-x-1/2 rounded-full opacity-30"
          style={{
            background:
              "radial-gradient(ellipse at center, #7d6cff 0%, #5fc8e8 35%, #e89cd8 55%, transparent 75%)",
          }}
        />
      )}
      <div className="relative z-[1]">{children}</div>
    </div>
  );
});
