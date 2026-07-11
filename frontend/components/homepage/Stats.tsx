"use client";

import { useEffect, useRef, useState } from "react";

const stats = [
  { value: "10K", suffix: "+", label: "Projects Managed" },
  { value: "2K", suffix: "+", label: "Happy Businesses" },
  { value: "$5M", suffix: "+", label: "Revenue Tracked" },
  { value: "99.9", suffix: "%", label: "Uptime" },
];

function parseNumber(raw: string): number {
  const cleaned = raw.replace(/[^0-9.]/g, "");
  return parseFloat(cleaned);
}

function formatDisplay(raw: string, val: number): string {
  if (raw.startsWith("$")) return `$${Math.floor(val)}`;
  if (raw.includes(".")) return val.toFixed(1);
  return String(Math.floor(val));
}

function CountUp({ target, suffix, prefix }: { target: number; suffix: string; prefix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const duration = 1500;
          const start = performance.now();

          function tick(now: number) {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(eased * target));
            if (progress < 1) requestAnimationFrame(tick);
          }

          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.3 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [target]);

  return (
    <span ref={ref}>
      {prefix}{count}{suffix}
    </span>
  );
}

export default function Stats() {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-28">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, i) => {
            const target = parseNumber(stat.value);
            const prefix = stat.value.startsWith("$") ? "$" : undefined;

            return (
              <div key={stat.label} className="relative flex flex-col items-center gap-2 text-center">
                {i > 0 && (
                  <>
                    <div className="h-px w-12 bg-slate-200 lg:hidden" />
                    <div className="hidden w-px self-stretch bg-slate-200 lg:block" />
                  </>
                )}

                <span className="text-4xl font-bold tracking-tight text-slate-900 lg:text-5xl">
                  {prefix === "$" ? (
                    <CountUp target={target} suffix={stat.suffix} prefix="$" />
                  ) : (
                    <CountUp target={target} suffix={stat.suffix} />
                  )}
                </span>

                <span className="text-sm font-medium text-slate-500">
                  {stat.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
