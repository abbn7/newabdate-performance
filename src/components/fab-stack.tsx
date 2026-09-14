"use client";
import { WhatsAppFab } from "./whatsapp-fab";
import { DevModeButton } from "./dev-mode";

export function FabStack() {
  return (
    <div className="fab-stack ui-enter-late pointer-events-none fixed z-40 flex flex-col items-center gap-2">
      <WhatsAppFab />
      <DevModeButton />
    </div>
  );
}
