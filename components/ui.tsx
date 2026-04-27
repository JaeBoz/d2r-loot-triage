import clsx from "clsx";
import { PropsWithChildren } from "react";

export function Card({
  children,
  className
}: PropsWithChildren<{ className?: string }>) {
  return (
    <section className={clsx("rounded-2xl border border-border bg-panel/90 p-4 shadow-glow sm:p-5", className)}>
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
        "inline-flex rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.16em]",
        active ? "border-highlight/60 bg-highlight/10 text-amber-200" : "border-border bg-black/20 text-zinc-300"
      )}
    >
      {children}
    </span>
  );
}
