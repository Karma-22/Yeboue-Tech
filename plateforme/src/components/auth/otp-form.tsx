"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { finishVerification, resendVerification, verifyEmail } from "@/app/(auth)/actions";
import { LogoMark } from "@/components/brand/logo";
import { cn } from "@/lib/utils/cn";

gsap.registerPlugin(useGSAP);

const LENGTH = 6;
const RESEND_SECONDS = 60;

type Notice = { kind: "error" | "success"; text: string } | null;

/**
 * La saisie du code à six chiffres. Un seul vrai champ, invisible, posé sur six
 * cases dessinées : le collage, le clavier numérique et la saisie automatique du
 * téléphone fonctionnent donc tout seuls. Chaque chiffre fait rebondir sa case ;
 * un mauvais code fait trembler la rangée ; le bon code la valide case par case.
 */
export function OtpForm() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [focused, setFocused] = useState(false);
  const [done, setDone] = useState(false);
  const [notice, setNotice] = useState<Notice>(null);
  const [seconds, setSeconds] = useState(RESEND_SECONDS);
  const [checking, startCheck] = useTransition();
  const [resending, startResend] = useTransition();
  const [, startFinish] = useTransition();
  const root = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const boxes = useRef<HTMLDivElement>(null);
  const success = useRef<HTMLDivElement>(null);
  const { contextSafe } = useGSAP({ scope: root });

  // Le compte à rebours avant de pouvoir redemander un code.
  useEffect(() => {
    if (seconds <= 0) return;
    const timer = window.setTimeout(() => setSeconds((value) => value - 1), 1000);
    return () => window.clearTimeout(timer);
  }, [seconds]);

  const pop = (index: number) => {
    contextSafe(() => {
      const box = boxes.current?.children[index];
      if (box) gsap.fromTo(box, { scale: 1.16, y: -4 }, { scale: 1, y: 0, duration: 0.35, ease: "back.out(3)" });
    })();
  };

  const shake = () => {
    contextSafe(() => {
      gsap.fromTo(
        boxes.current,
        { x: -10 },
        { x: 0, duration: 0.5, ease: "elastic.out(1.2, 0.3)", onComplete: () => input.current?.focus() },
      );
    })();
  };

  const celebrate = () => {
    contextSafe(() => {
      const cells = boxes.current ? Array.from(boxes.current.children) : [];
      gsap
        // L'animation jouée, le serveur ouvre la session vérifiée et envoie à la bonne page.
        .timeline({ onComplete: () => startFinish(() => finishVerification()) })
        // La couleur de réussite vient des classes (voir `done`) ; ici, seulement le mouvement.
        .to(cells, { y: -6, duration: 0.22, stagger: 0.07, ease: "power2.out" })
        .to(cells, { y: 0, duration: 0.3, stagger: 0.07, ease: "bounce.out" }, "<0.12")
        .fromTo(
          success.current,
          { autoAlpha: 0, scale: 0.4, rotation: -30 },
          { autoAlpha: 1, scale: 1, rotation: 0, duration: 0.55, ease: "back.out(2)" },
          "-=0.15",
        )
        .to({}, { duration: 0.5 });
    })();
  };

  /** Envoie le code au serveur, puis joue la réussite ou l'erreur. */
  const submit = (value: string) => {
    startCheck(async () => {
      const data = new FormData();
      data.set("code", value);
      const result = await verifyEmail({}, data);
      if (result.ok) {
        setNotice(null);
        setDone(true);
        celebrate();
      } else {
        setNotice({ kind: "error", text: result.message ?? "Ce code n'est pas le bon." });
        setCode("");
        shake();
      }
    });
  };

  const change = (event: React.ChangeEvent<HTMLInputElement>) => {
    const next = event.target.value.replace(/\D/g, "").slice(0, LENGTH);
    if (next.length > code.length) pop(next.length - 1);
    setCode(next);
    // Le code est complet : on l'envoie sans attendre un bouton.
    if (next.length === LENGTH) submit(next);
  };

  const askAgain = () => {
    startResend(async () => {
      const result = await resendVerification();
      setNotice({ kind: result.ok ? "success" : "error", text: result.message ?? "" });
      if (result.ok) {
        setSeconds(RESEND_SECONDS);
        setCode("");
        // La page relit le code de développement, s'il y en a un.
        router.refresh();
      }
    });
  };

  return (
    <div ref={root} className="grid gap-6">
      <div className="relative">
        <div ref={boxes} aria-hidden="true" className="flex justify-between gap-2">
          {Array.from({ length: LENGTH }, (_, index) => {
            const active = focused && !done && index === Math.min(code.length, LENGTH - 1);
            return (
              <div
                key={index}
                className={cn(
                  "relative grid h-16 w-full max-w-14 place-items-center rounded-md border bg-surface-raised font-display text-3xl font-bold transition-[border-color,box-shadow,background-color,color] duration-200",
                  done
                    ? "border-success bg-success-soft text-success-text"
                    : active
                      ? "border-fg ring-3 ring-fg/15"
                      : "border-line-strong",
                )}
              >
                {code[index] ?? ""}
                {active && code.length < LENGTH && (
                  <span className="absolute h-7 w-0.5 animate-pulse rounded-full bg-fg" />
                )}
              </div>
            );
          })}
        </div>

        <input
          ref={input}
          name="code"
          value={code}
          onChange={change}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          inputMode="numeric"
          autoComplete="one-time-code"
          pattern="\d{6}"
          maxLength={LENGTH}
          autoFocus
          disabled={checking || done}
          aria-label="Code de vérification à six chiffres"
          aria-describedby="otp-status"
          className="absolute inset-0 size-full cursor-text opacity-0"
        />

        <div
          ref={success}
          aria-hidden="true"
          className="invisible absolute inset-x-0 -top-20 grid place-items-center opacity-0"
        >
          <LogoMark className="size-14" />
        </div>
      </div>

      <p id="otp-status" role="status" className="min-h-6 text-sm font-medium">
        {done ? (
          <span className="text-success-text">Adresse vérifiée. On y va…</span>
        ) : checking ? (
          <span className="text-fg-muted">Vérification…</span>
        ) : notice ? (
          <span className={notice.kind === "success" ? "text-success-text" : "text-danger-text"}>
            {notice.text}
          </span>
        ) : null}
      </p>

      <p className="text-sm text-fg-muted">
        Rien reçu ?{" "}
        {seconds > 0 ? (
          <span className="tabular-nums">Nouveau code possible dans {seconds} s.</span>
        ) : (
          <button
            type="button"
            onClick={askAgain}
            disabled={resending || done}
            className="rounded-sm font-semibold text-fg underline underline-offset-4 disabled:opacity-50"
          >
            Renvoyer un code
          </button>
        )}
      </p>
    </div>
  );
}
