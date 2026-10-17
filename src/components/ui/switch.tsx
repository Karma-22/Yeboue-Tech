"use client";

import { Switch as SwitchPrimitive } from "radix-ui";
import { cn } from "@/lib/utils/cn";

/** Interrupteur : un réglage qui s'applique tout de suite (plat disponible ou en rupture). */
export function Switch({ className, ...props }: React.ComponentProps<typeof SwitchPrimitive.Root>) {
  return (
    <SwitchPrimitive.Root
      className={cn(
        "peer inline-flex h-7 w-12 shrink-0 cursor-pointer items-center rounded-full bg-line-strong p-0.5",
        "transition-colors duration-200 ease-out",
        "data-[state=checked]:bg-fg",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        className={cn(
          "block size-6 rounded-full bg-surface-raised shadow-sm",
          "transition-transform duration-200 ease-emphasized",
          "data-[state=checked]:translate-x-5",
        )}
      />
    </SwitchPrimitive.Root>
  );
}
