"use client";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

export function TextRotator({
  items,
  interval = 2600,
  className,
  active = true,
}: {
  items: string[];
  interval?: number;
  className?: string;
  active?: boolean;
}) {
  const [i, setI] = useState(0);
  const reduced = useReducedMotion();
  useEffect(() => {
    let timer = 0;
    const sync = () => {
      window.clearInterval(timer);
      if (!active || reduced || document.hidden || items.length < 2) return;
      timer = window.setInterval(() => setI((value) => (value + 1) % items.length), interval);
    };
    sync();
    document.addEventListener("visibilitychange", sync);
    return () => {
      window.clearInterval(timer);
      document.removeEventListener("visibilitychange", sync);
    };
  }, [active, reduced, items.length, interval]);

  if (!items.length) return null;
  const current = items[i % items.length];
  return (
    <span className={"relative inline-block align-baseline " + (className ?? "")}>
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={current}
          initial={{ y: reduced ? 0 : "0.6em", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: reduced ? 0 : "-0.6em", opacity: 0 }}
          transition={{ duration: reduced ? 0 : 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="inline-block"
        >
          {current}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
