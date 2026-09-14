"use client";
import { useEffect } from "react";
import { useRouterState } from "@tanstack/react-router";

// Pause CSS decoration outside the viewport instead of painting the whole page.
export function MotionLifecycle() {
  const pathname = useRouterState({ select: (state) => state.location.pathname });

  useEffect(() => {
    const selector = ".animate-gradient, .animate-pulse-soft, .animate-float, .animate-spin-slow";
    const root = document.documentElement;
    let scrollTimer = 0;
    const onScroll = () => {
      // Avoid invalidating styles on every scroll event; only the first and
      // final event change the document state.
      if (!root.hasAttribute("data-scrolling")) {
        root.setAttribute("data-scrolling", "");
        window.dispatchEvent(new Event("portfolio:scroll-start"));
      }
      window.clearTimeout(scrollTimer);
      scrollTimer = window.setTimeout(() => {
        root.removeAttribute("data-scrolling");
        window.dispatchEvent(new Event("portfolio:scroll-end"));
      }, 140);
    };
    const sync = () => root.toggleAttribute("data-page-hidden", document.hidden);
    sync();
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("visibilitychange", sync);
    const observer = typeof IntersectionObserver === "undefined" ? null : new IntersectionObserver(
      (entries) => entries.forEach((entry) => {
        entry.target.toggleAttribute("data-motion-paused", !entry.isIntersecting);
      }),
      { rootMargin: "40px" },
    );
    const observeTimer = window.setTimeout(() => {
      document.querySelectorAll(selector).forEach((element) => observer?.observe(element));
    }, 0);
    return () => {
      window.clearTimeout(scrollTimer);
      window.clearTimeout(observeTimer);
      window.removeEventListener("scroll", onScroll);
      root.removeAttribute("data-scrolling");
      observer?.disconnect();
      document.removeEventListener("visibilitychange", sync);
      root.removeAttribute("data-page-hidden");
    };
  }, [pathname]);
  return null;
}
