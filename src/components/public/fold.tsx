"use client";

import { Accordion } from "radix-ui";
import { cn } from "@/lib/utils/cn";

/** Des volets qui s'ouvrent et se referment : plusieurs peuvent rester ouverts à la fois. */
export function Folds({
  defaultOpen,
  className,
  children,
}: {
  /** Les volets ouverts à l'arrivée. */
  defaultOpen: string[];
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <Accordion.Root type="multiple" defaultValue={defaultOpen} className={className}>
      {children}
    </Accordion.Root>
  );
}

interface FoldProps {
  value: string;
  id?: string;
  /** Ce qui reste visible quand le volet est fermé. Peut réagir à l'ouverture par `group-data-[state=open]:`. */
  header: React.ReactNode;
  className?: string;
  triggerClassName?: string;
  children: React.ReactNode;
}

export function Fold({ value, id, header, className, triggerClassName, children }: FoldProps) {
  return (
    <Accordion.Item value={value} id={id} className={className}>
      <Accordion.Header>
        <Accordion.Trigger className={cn("group flex w-full items-center text-left", triggerClassName)}>
          {header}
        </Accordion.Trigger>
      </Accordion.Header>
      <Accordion.Content className="overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
        {children}
      </Accordion.Content>
    </Accordion.Item>
  );
}
