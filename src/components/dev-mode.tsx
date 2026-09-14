"use client";
import { Code2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Logo } from "./logo";
import { STACK, ARCH } from "@/lib/dev-manifest";
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription } from "./ui/dialog";

export function DevModeButton() {
  const { t } = useTranslation();
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          type="button"
          aria-label={t("dev.title")}
          title={t("dev.title")}
          className="pointer-events-auto grid size-11 place-items-center rounded-full glass-strong shadow-xl transition-transform hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
        >
          <Code2 className="size-4 opacity-90" strokeWidth={1.75} />
        </button>
      </DialogTrigger>
      <DialogContent
        data-lenis-prevent
        className="dev-dialog top-auto bottom-[max(0.75rem,env(safe-area-inset-bottom))] z-[60] max-h-[82dvh] w-[calc(100%_-_1.5rem)] max-w-md translate-y-0 gap-0 overflow-y-auto overscroll-contain rounded-3xl glass-strong p-6 sm:bottom-6 sm:rounded-3xl"
      >
        <div className="flex items-center gap-3 pe-7">
          <Logo size={28} />
          <div>
            <DialogTitle className="font-display text-xl font-normal leading-tight">{t("dev.title")}</DialogTitle>
            <DialogDescription className="mt-1 text-xs">{t("dev.subtitle")}</DialogDescription>
          </div>
        </div>
              <section className="mt-6">
                <h4 className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                  {t("dev.arch")}
                </h4>
                <ul className="mt-2 space-y-1 font-mono text-xs text-foreground/80">
                  {ARCH.map((line) => (
                    <li key={line} className="opacity-90">
                      · {line}
                    </li>
                  ))}
                </ul>
              </section>

              <section className="mt-5">
                <h4 className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                  {t("dev.libs")}
                </h4>
                <ul className="mt-2 grid grid-cols-1 gap-1.5 text-sm">
                  {STACK.map(([name, desc]) => (
                    <li
                      key={name}
                      className="flex items-baseline justify-between gap-3 border-b border-[var(--glass-border)] py-1.5"
                    >
                      <span className="font-medium">{name}</span>
                      <span className="text-xs text-muted-foreground">{desc}</span>
                    </li>
                  ))}
                </ul>
              </section>
      </DialogContent>
    </Dialog>
  );
}
