import clsx from "clsx";
import { PropsWithChildren } from "react";

export function Card({
  children,
  className
}: PropsWithChildren<{ className?: string }>) {
  return (
    <section className={clsx("rounded-2xl border border-border bg-panel/90 p-5 shadow-glow", className)}>
      {children}
    </section>
  );
}

export function Pill({
  children,
  active = false
}: PropsWithChildren<{ active?: boolean }>) {
  return (
    <span
      className={clsx(
        "inline-flex rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]",
        active ? "border-accent/50 bg-accent/10 text-accent" : "border-border bg-black/20 text-zinc-300"
      )}
    >
      {children}
    </span>
  );
}
