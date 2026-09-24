"use client";

import { useEffect, useState } from "react";
import type { ComponentType } from "react";

type Vitals = {
  Analytics: ComponentType;
  SpeedInsights: ComponentType;
};

export function IdleVitals() {
  const [components, setComponents] = useState<Vitals | null>(null);

  useEffect(() => {
    let cancelled = false;
    let timeout: ReturnType<typeof setTimeout> | undefined;
    let idle = 0;

    const load = async () => {
      const [{ Analytics }, { SpeedInsights }] = await Promise.all([
        import("@vercel/analytics/react"),
        import("@vercel/speed-insights/react"),
      ]);
      if (!cancelled) setComponents({ Analytics, SpeedInsights });
    };

    if ("requestIdleCallback" in window) {
      idle = window.requestIdleCallback(() => void load(), { timeout: 4500 });
    } else {
      timeout = globalThis.setTimeout(() => void load(), 2500);
    }

    return () => {
      cancelled = true;
      if (timeout) globalThis.clearTimeout(timeout);
      if (idle) window.cancelIdleCallback(idle);
    };
  }, []);

  if (!components) return null;
  const { Analytics, SpeedInsights } = components;
  return (
    <>
      <Analytics />
      <SpeedInsights />
    </>
  );
}
