"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  // Lenis smooth scroll
  useEffect(() => {
    const lenis = new Lenis({ 
      duration: 1.2, 
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });
    
    const onRaf = (time: number) => { 
      lenis.raf(time); 
      requestAnimationFrame(onRaf); 
    };
    requestAnimationFrame(onRaf);
    
    // Sync with GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => { lenis.raf(time * 1000); });
    gsap.ticker.lagSmoothing(0);
    
    return () => { lenis.destroy(); };
  }, []);

  useEffect(() => {
    const isChunkError = (msg: string) =>
      /ChunkLoadError|Loading chunk [\w\d]+ failed|Failed to fetch dynamically imported module/i.test(msg);

    const onError = (e: ErrorEvent) => {
      const msg = e.error?.message || e.message || "";
      if (isChunkError(msg) && !sessionStorage.getItem("__chunkReloaded")) {
        sessionStorage.setItem("__chunkReloaded", "1");
        window.location.reload();
      }
    };
    const onRejection = (e: PromiseRejectionEvent) => {
      const msg = (e.reason && (e.reason.message || String(e.reason))) || "";
      if (isChunkError(msg) && !sessionStorage.getItem("__chunkReloaded")) {
        sessionStorage.setItem("__chunkReloaded", "1");
        window.location.reload();
      }
    };

    window.addEventListener("error", onError);
    window.addEventListener("unhandledrejection", onRejection);
    return () => {
      window.removeEventListener("error", onError);
      window.removeEventListener("unhandledrejection", onRejection);
    };
  }, []);

  return <>{children}</>;
}

