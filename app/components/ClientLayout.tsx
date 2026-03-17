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

  // Cursor — fully imperative, appended directly to documentElement
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Create cursor elements imperatively — outside React tree entirely
    const dot = document.createElement('div');
    dot.id = 'cursor-dot';
    
    const ring = document.createElement('div');
    ring.id = 'cursor-ring';
    
    // Set inline styles to guarantee visibility - make them VERY visible
    Object.assign(dot.style, {
      position: 'fixed',
      top: '0px',
      left: '0px',
      width: '20px',
      height: '20px',
      backgroundColor: '#00FF00',
      borderRadius: '50%',
      pointerEvents: 'none',
      zIndex: '999999999',
    });
    
    Object.assign(ring.style, {
      position: 'fixed',
      top: '0px',
      left: '0px',
      width: '50px',
      height: '50px',
      border: '3px solid #00FF00',
      borderRadius: '50%',
      pointerEvents: 'none',
      zIndex: '999999998',
    });
    
    // Add to body instead of documentElement for better compatibility
    document.body.appendChild(dot);
    document.body.appendChild(ring);
    
    console.log('Cursor dot created:', dot);
    console.log('Cursor ring created:', ring);
    console.log('Dot parent:', dot.parentElement?.tagName);
    console.log('Ring parent:', ring.parentElement?.tagName);

    // Note: Touch detection removed - cursor always visible for desktop browsers
    // Users with touch devices can still use the custom cursor

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;
    let rafId: number;

    // Linear interpolation function for smooth following
    const lerp = (a: number, b: number, n: number) => (1 - n) * a + n * b;

    // Move dot instantly
    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.transform = `translate(${mouseX - 10}px, ${mouseY - 10}px)`;
    };

    // Ring follows with lerp
    const loop = () => {
      ringX = lerp(ringX, mouseX, 0.15);
      ringY = lerp(ringY, mouseY, 0.15);
      ring.style.transform = `translate(${ringX - 25}px, ${ringY - 25}px)`;
      rafId = requestAnimationFrame(loop);
    };
    rafId = requestAnimationFrame(loop);

    // Event delegation for hover detection
    const HOVER_SELECTOR = 'a, button, input, select, textarea, label, [role="button"], [data-hover], canvas';

    const onMouseOver = (e: MouseEvent) => {
      if ((e.target as Element).closest(HOVER_SELECTOR)) {
        dot.classList.add('is-hovering');
        ring.classList.add('is-hovering');
        dot.style.width = '0';
        dot.style.height = '0';
        dot.style.opacity = '0';
        ring.style.width = '80px';
        ring.style.height = '80px';
        ring.style.borderColor = '#00FF00';
      }
    };

    const onMouseOut = (e: MouseEvent) => {
      if ((e.target as Element).closest(HOVER_SELECTOR)) {
        dot.classList.remove('is-hovering');
        ring.classList.remove('is-hovering');
        dot.style.width = '20px';
        dot.style.height = '20px';
        dot.style.opacity = '1';
        ring.style.width = '50px';
        ring.style.height = '50px';
        ring.style.borderColor = '#00FF00';
      }
    };

    // Hide cursor when it leaves the window
    const onMouseLeave = () => {
      dot.style.opacity = '0';
      ring.style.opacity = '0';
    };
    
    const onMouseEnter = () => {
      dot.style.opacity = '1';
      ring.style.opacity = '1';
    };

    document.addEventListener('mousemove', onMouseMove, { passive: true });
    document.addEventListener('mouseover', onMouseOver);
    document.addEventListener('mouseout', onMouseOut);
    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('mouseenter', onMouseEnter);

    return () => {
      cancelAnimationFrame(rafId);
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseover', onMouseOver);
      document.removeEventListener('mouseout', onMouseOut);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseenter', onMouseEnter);
      if (document.body.contains(dot)) document.body.removeChild(dot);
      if (document.body.contains(ring)) document.body.removeChild(ring);
    };
  }, []);

  return <>{children}</>;
}
