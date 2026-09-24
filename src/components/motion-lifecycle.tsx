"use client";
import { useEffect } from "react";
import { useRouterState } from "@tanstack/react-router";

// Pause CSS decoration outside the viewport without changing hydrated DOM.
export function MotionLifecycle() {
  const pathname = useRouterState({ select: (state) => state.location.pathname });

  useEffect(() => {
    const root = document.documentElement;
    const animated = new Set<Element>();
    const visible = new Set<Element>();
    const setPaused = (element: Element, paused: boolean) => {
      if (typeof CSSAnimation === "undefined") return;
      element.getAnimations().forEach((animation) => {
        if (!(animation instanceof CSSAnimation)) return;
        if (paused && animation.playState === "running") animation.pause();
        if (!paused && animation.playState === "paused") animation.play();
      });
    };
    const observer =
      typeof IntersectionObserver === "undefined"
        ? null
        : new IntersectionObserver(
            (entries) =>
              entries.forEach((entry) => {
                if (entry.isIntersecting) visible.add(entry.target);
                else visible.delete(entry.target);
                setPaused(
                  entry.target,
                  !entry.isIntersecting || document.hidden || root.hasAttribute("data-scrolling"),
                );
              }),
            { rootMargin: "40px" },
          );
    const observeTimer = window.setTimeout(() => {
      document
        .querySelectorAll(
          ".animate-gradient, .animate-pulse-soft, .animate-float, .animate-spin-slow",
        )
        .forEach((element) => {
          animated.add(element);
          observer?.observe(element);
        });
    }, 1200);
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
        visible.forEach((element) => setPaused(element, document.hidden));
        window.dispatchEvent(new Event("portfolio:scroll-end"));
      }, 140);
    };
    const sync = () => {
      root.toggleAttribute("data-page-hidden", document.hidden);
      if (!document.hidden) visible.forEach((element) => setPaused(element, false));
    };
    sync();
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("visibilitychange", sync);
    return () => {
      window.clearTimeout(scrollTimer);
      window.clearTimeout(observeTimer);
      window.removeEventListener("scroll", onScroll);
      root.removeAttribute("data-scrolling");
      observer?.disconnect();
      animated.forEach((element) => setPaused(element, false));
      document.removeEventListener("visibilitychange", sync);
      root.removeAttribute("data-page-hidden");
    };
  }, [pathname]);
  return null;
}
