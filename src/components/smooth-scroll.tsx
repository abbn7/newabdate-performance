"use client";
import { useEffect } from "react";
import { useRouterState } from "@tanstack/react-router";
import Lenis from "lenis";

export function SmoothScroll() {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  useEffect(() => {
    // Native touch inertia stays on the browser's compositor, especially on iOS.
    const media = matchMedia("(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)");
    let dispose: (() => void) | undefined;
    const configure = () => {
      dispose?.();
      dispose = undefined;
      if (!media.matches) return;
      const lenis = new Lenis({
        duration: 0.85,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        syncTouch: false,
        autoRaf: false,
        prevent: (node) => node.hasAttribute("data-lenis-prevent"),
      });
      let raf = 0;
      const loop = (time: number) => {
        raf = 0;
        if (document.hidden) return;
        lenis.raf(time);
        if (lenis.isScrolling === "smooth") raf = requestAnimationFrame(loop);
      };
      const wake = () => {
        if (raf || document.hidden) return;
        // Reset the clock after idling, before applying the next wheel delta.
        lenis.raf(performance.now());
        raf = requestAnimationFrame(loop);
      };
      const onVisibility = () => {
        cancelAnimationFrame(raf);
        raf = 0;
        if (document.hidden) lenis.stop();
        else lenis.start();
      };
      window.addEventListener("wheel", wake, { passive: true, capture: true });
      document.addEventListener("visibilitychange", onVisibility);
      dispose = () => {
        cancelAnimationFrame(raf);
        window.removeEventListener("wheel", wake, true);
        document.removeEventListener("visibilitychange", onVisibility);
        lenis.destroy();
      };
    };
    configure();
    media.addEventListener("change", configure);
    return () => {
      dispose?.();
      media.removeEventListener("change", configure);
    };
  }, [pathname]);
  return null;
}
