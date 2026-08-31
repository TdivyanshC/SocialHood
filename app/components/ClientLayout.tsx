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
    
    // One driver only. This used to run a self-recursing requestAnimationFrame
    // loop *and* a gsap.ticker callback, so lenis.raf() was called twice per
    // frame; the rAF loop was also never cancelled, so it kept calling into a
    // destroyed Lenis after unmount.
    lenis.on('scroll', ScrollTrigger.update);
    const tick = (time: number) => { lenis.raf(time * 1000); };
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      lenis.off('scroll', ScrollTrigger.update);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}

