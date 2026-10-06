"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { advanceOrder, liveToken } from "@/app/app/[estId]/actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import type { Order, OrderStatus } from "@/lib/db/types";
import { isOpen, STATUS_LABELS } from "@/lib/orders/rules";
import { cn } from "@/lib/utils/cn";
import { formatPrice } from "@/lib/utils/format";

/* L'écran de commandes (ARCHITECTURE.md §6.6) : elles arrivent en direct, une sonnerie les annonce. */

interface OrdersBoardProps {
  establishmentId: string;
  /** Les commandes déjà là au chargement de la page. */
  initial: Order[];
  /** L'écoute commence à cet instant : on ne suit que le service en cours. */
  since: number;
}

const TONE: Record<OrderStatus, "accent" | "signal" | "success" | "neutral" | "danger"> = {
  new: "accent",
  accepted: "signal",
  ready: "success",
  served: "neutral",
  rejected: "danger",
  cancelled: "danger",
};

/** Deux notes brèves, fabriquées par le navigateur : aucun fichier son à télécharger. */
function chime(context: AudioContext) {
  [880, 1174.66].forEach((frequency, index) => {
    const start = context.currentTime + index * 0.16;
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.frequency.value = frequency;
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(0.35, start + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.5);
    oscillator.connect(gain).connect(context.destination);
    oscillator.start(start);
    oscillator.stop(start + 0.55);
  });
}

function since(timestamp: number, now: number): string {
  const minutes = Math.max(0, Math.round((now - timestamp) / 60_000));
  if (minutes < 1) return "À l'instant";
  if (minutes < 60) return `Il y a ${minutes} min`;
  return `Il y a ${Math.floor(minutes / 60)} h ${String(minutes % 60).padStart(2, "0")}`;
}

export function OrdersBoard({ establishmentId, initial, since: start }: OrdersBoardProps) {
  const [orders, setOrders] = useState(initial);
  const [live, setLive] = useState<"connecting" | "on" | "off">("connecting");
  const [sound, setSound] = useState(false);
  const [now, setNow] = useState(start);
  const [rejecting, setRejecting] = useState<Order | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startAction] = useTransition();
  const audio = useRef<AudioContext | null>(null);
  const known = useRef(new Set(initial.map((order) => order.id)));
  const soundOn = useRef(false);

  // L'écoute en direct : un jeton du serveur ouvre la lecture des commandes de cet établissement.
  useEffect(() => {
    let cancelled = false;
    let stop = () => {};
    (async () => {
      try {
        const [{ connectStaff, watchOrders }, token] = await Promise.all([
          import("@/lib/db/live"),
          liveToken(establishmentId),
        ]);
        await connectStaff(token);
        if (cancelled) return;
        stop = watchOrders(
          establishmentId,
          start,
          (next) => {
            const fresh = next.some((order) => order.status === "new" && !known.current.has(order.id));
            next.forEach((order) => known.current.add(order.id));
            if (fresh && soundOn.current && audio.current) chime(audio.current);
            setOrders(next);
            setLive("on");
          },
          () => setLive("off"),
        );
      } catch {
        if (!cancelled) setLive("off");
      }
    })();
    return () => {
      cancelled = true;
      stop();
    };
  }, [establishmentId, start]);

  // L'heure avance toute seule, pour les « Il y a 4 min ».
  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 30_000);
    return () => window.clearInterval(timer);
  }, []);

  const toggleSound = () => {
    // Les navigateurs n'autorisent le son qu'après un geste : c'est ce bouton.
    if (!audio.current) audio.current = new AudioContext();
    void audio.current.resume();
    soundOn.current = !sound;
    if (!sound) chime(audio.current);
    setSound(!sound);
  };

  const advance = (order: Order, status: OrderStatus, reason = "") =>
    startAction(async () => {
      const result = await advanceOrder(establishmentId, order.id, status, reason);
      setError(result.ok ? null : (result.message ?? "Cela n'a pas fonctionné."));
      // Sans le direct, on applique le changement à la main.
      if (result.ok) setOrders((current) => current.map((entry) => (entry.id === order.id ? { ...entry, status } : entry)));
    });

  const open = orders.filter((order) => isOpen(order.status)).sort((a, b) => a.createdAt - b.createdAt);
  const closed = orders.filter((order) => !isOpen(order.status));

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <Badge tone={live === "on" ? "signal" : live === "off" ? "danger" : "neutral"} dot={live === "on" ? "live" : true}>
          {live === "on" ? "En direct" : live === "off" ? "Direct coupé : rechargez la page" : "Connexion…"}
        </Badge>
        <Button variant={sound ? "secondary" : "outline"} size="sm" onClick={toggleSound}>
          {sound ? <Volume2 aria-hidden="true" className="size-4" /> : <VolumeX aria-hidden="true" className="size-4" />}
          {sound ? "Son activé" : "Activer le son"}
        </Button>
      </div>

      {error && (
        <p role="alert" className="mb-4 rounded-md bg-danger-soft px-4 py-3 text-sm font-medium text-danger-text">
          {error}
        </p>
      )}

      {open.length === 0 && (
        <div className="rounded-lg border border-dashed border-line-strong p-10 text-center">
          <p className="font-display text-xl font-bold">Aucune commande en cours.</p>
          <p className="mt-2 text-fg-muted">Elles apparaîtront ici dès qu&apos;un client validera son panier.</p>
        </div>
      )}

      <ul className="grid gap-4 sm:grid-cols-2">
        <AnimatePresence initial={false}>
          {open.map((order) => (
            <motion.li
              key={order.id}
              layout
              initial={{ opacity: 0, scale: 0.92, y: -12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94 }}
              transition={{ type: "spring", stiffness: 380, damping: 30 }}
              className={cn(
                "flex flex-col rounded-lg border bg-surface-raised p-5 shadow-sm",
                order.status === "new" ? "border-accent" : "border-line",
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate font-display text-xl leading-tight font-bold">{order.tableLabel}</p>
                  <p className="text-sm text-fg-muted">{since(order.createdAt, now)}</p>
                </div>
                <Badge tone={TONE[order.status]} dot={order.status === "new" ? "live" : false}>
                  {STATUS_LABELS[order.status]}
                </Badge>
              </div>
              <ul className="mt-4 grid gap-1.5">
                {order.lines.map((line) => (
                  <li key={line.itemId} className="flex gap-2.5">
                    <span className="font-display font-bold tabular-nums">{line.quantity} ×</span>
                    <span>{line.name}</span>
                  </li>
                ))}
              </ul>
              {order.note && (
                <p className="mt-3 rounded-md bg-warning-soft px-3 py-2 text-sm font-medium text-warning-text">
                  « {order.note} »
                </p>
              )}
              <p className="mt-4 mb-4 border-t border-line pt-3 text-right font-display text-lg font-bold tabular-nums">
                {formatPrice(order.total)}
              </p>
              <div className="mt-auto flex gap-2">
                {order.status === "new" && (
                  <>
                    <Button variant="outline" disabled={pending} onClick={() => setRejecting(order)}>
                      Refuser
                    </Button>
                    <Button block disabled={pending} onClick={() => advance(order, "accepted")}>
                      Accepter
                    </Button>
                  </>
                )}
                {order.status === "accepted" && (
                  <>
                    <Button variant="outline" disabled={pending} onClick={() => advance(order, "cancelled")}>
                      Annuler
                    </Button>
                    <Button variant="secondary" block disabled={pending} onClick={() => advance(order, "ready")}>
                      Prête
                    </Button>
                  </>
                )}
                {order.status === "ready" && (
                  <Button variant="secondary" block disabled={pending} onClick={() => advance(order, "served")}>
                    Servie
                  </Button>
                )}
              </div>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>

      {closed.length > 0 && (
        <details className="mt-10">
          <summary className="cursor-pointer font-display text-lg font-bold">Terminées ({closed.length})</summary>
          <ul className="mt-4 divide-y divide-line rounded-lg border border-line bg-surface-raised">
            {closed.map((order) => (
              <li key={order.id} className="flex items-center justify-between gap-3 px-4 py-3 text-sm">
                <span className="min-w-0">
                  <span className="block truncate font-semibold">{order.tableLabel}</span>
                  <span className="text-fg-muted">
                    {order.lines.map((line) => `${line.quantity} × ${line.name}`).join(", ")}
                  </span>
                </span>
                <span className="flex shrink-0 items-center gap-3">
                  <span className="tabular-nums">{formatPrice(order.total)}</span>
                  <Badge tone={TONE[order.status]}>{STATUS_LABELS[order.status]}</Badge>
                </span>
              </li>
            ))}
          </ul>
        </details>
      )}

      {rejecting && (
        <Dialog open onOpenChange={(isOpening) => !isOpening && setRejecting(null)}>
          <DialogContent>
            <DialogTitle>Refuser cette commande ?</DialogTitle>
            <DialogDescription>
              {rejecting.tableLabel}. Le client verra le motif sur son téléphone.
            </DialogDescription>
            <form
              className="grid gap-4"
              onSubmit={(event) => {
                event.preventDefault();
                const reason = String(new FormData(event.currentTarget).get("reason") ?? "");
                advance(rejecting, "rejected", reason);
                setRejecting(null);
              }}
            >
              <Input name="reason" placeholder="Le motif : « Il n'y a plus de poisson »" maxLength={120} autoFocus />
              <DialogFooter>
                <Button type="submit" variant="danger">
                  Refuser la commande
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
