"use client";

import { X } from "lucide-react";
import { Dialog as DialogPrimitive } from "radix-ui";
import { cn } from "@/lib/utils/cn";

export const Dialog = DialogPrimitive.Root;
export const DialogTrigger = DialogPrimitive.Trigger;
export const DialogClose = DialogPrimitive.Close;

/**
 * Fenêtre de dialogue. Sur téléphone, elle monte du bas de l'écran, à portée
 * de pouce ; sur grand écran, elle s'ouvre au centre.
 */
export function DialogContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Content>) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-overlay data-[state=closed]:animate-overlay-out data-[state=open]:animate-overlay-in" />
      <DialogPrimitive.Content
        className={cn(
          "fixed z-50 grid max-h-[calc(100dvh-2rem)] gap-4 overflow-y-auto bg-surface-raised p-6 text-fg shadow-lg focus-visible:outline-hidden",
          "inset-x-0 bottom-0 rounded-t-xl pb-[calc(1.5rem+env(safe-area-inset-bottom))]",
          "data-[state=closed]:animate-sheet-out data-[state=open]:animate-sheet-in",
          "sm:inset-x-auto sm:top-1/2 sm:bottom-auto sm:left-1/2 sm:w-[calc(100%-2rem)] sm:max-w-md sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-xl sm:pb-6",
          "sm:data-[state=closed]:animate-dialog-out sm:data-[state=open]:animate-dialog-in",
          className,
        )}
        {...props}
      >
        {children}
        <DialogPrimitive.Close
          aria-label="Fermer"
          className="absolute top-3 right-3 grid size-10 place-items-center rounded-full text-fg-muted transition-colors hover:bg-fg/7 hover:text-fg"
        >
          <X aria-hidden="true" className="size-5" />
        </DialogPrimitive.Close>
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
}

export function DialogTitle({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Title>) {
  return <DialogPrimitive.Title className={cn("type-title pr-10", className)} {...props} />;
}

export function DialogDescription({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Description>) {
  return <DialogPrimitive.Description className={cn("text-fg-muted", className)} {...props} />;
}

/** Rangée de boutons : empilés sur téléphone, l'action principale à droite sur grand écran. */
export function DialogFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("mt-2 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end", className)}
      {...props}
    />
  );
}
