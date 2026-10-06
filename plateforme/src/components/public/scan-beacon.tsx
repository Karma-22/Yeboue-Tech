"use client";

import { useEffect } from "react";

/**
 * Prévient le serveur qu'un client vient d'ouvrir la carte, pour les
 * statistiques du gérant. Une seule fois par visite : recharger la page ne
 * compte pas un deuxième scan.
 */
export function ScanBeacon({ slug }: { slug: string }) {
  useEffect(() => {
    const key = `scan:${slug}`;
    try {
      if (sessionStorage.getItem(key)) return;
      sessionStorage.setItem(key, "1");
    } catch {
      // Navigation privée : le stockage est fermé, on compte quand même.
    }
    navigator.sendBeacon?.(`/api/scan?slug=${encodeURIComponent(slug)}&kind=scan`);
  }, [slug]);

  return null;
}
