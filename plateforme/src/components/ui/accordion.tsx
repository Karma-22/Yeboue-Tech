"use client";

import { Plus } from "lucide-react";
import { Accordion as AccordionPrimitive } from "radix-ui";
import { cn } from "@/lib/utils/cn";

interface AccordionProps {
  /** La question ouverte à l'arrivée, s'il y en a une. */
  defaultValue?: string;
  className?: string;
  children: React.ReactNode;
}

/** Liste de questions qui se déplient une à une. */
export function Accordion({ defaultValue, className, children }: AccordionProps) {
  return (
    <AccordionPrimitive.Root
      type="single"
      collapsible
      defaultValue={defaultValue}
      className={cn("border-t border-line", className)}
    >
      {children}
    </AccordionPrimitive.Root>
  );
}

interface AccordionItemProps {
  value: string;
  question: string;
  children: React.ReactNode;
}

export function AccordionItem({ value, question, children }: AccordionItemProps) {
  return (
    <AccordionPrimitive.Item value={value} className="border-b border-line">
      <AccordionPrimitive.Header>
        <AccordionPrimitive.Trigger className="group flex w-full items-center justify-between gap-6 py-5 text-left text-lg font-semibold">
          {question}
          <Plus
            aria-hidden="true"
            className="size-5 shrink-0 text-fg-muted transition-transform duration-300 ease-emphasized group-data-[state=open]:rotate-45"
          />
        </AccordionPrimitive.Trigger>
      </AccordionPrimitive.Header>
      <AccordionPrimitive.Content className="overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
        <div className="max-w-prose pr-8 pb-6 text-fg-muted">{children}</div>
      </AccordionPrimitive.Content>
    </AccordionPrimitive.Item>
  );
}
