"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

// 3D APPROACH: Option A - Vanilla Three.js loaded via CDN
// This provides full control over particle systems and custom shaders
// Particle constellation field - visually connected, social-media-themed

declare global {
  interface Window {
    THREE: typeof import("three");
  }
}

interface Particle {
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  baseX: number;
  baseY: number;
  baseZ: number;
}

export default function Hero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [is3DReady, setIs3DReady] = useState(false);

  useEffect(() => {
    let animationId: number;
    let scene: import("three").Scene;
    let camera: import("three").PerspectiveCamera;
    let renderer: import("three").WebGLRenderer;
    let particles: Particle[] = [];
    let particlePositions: Float32Array;
    let linePositions: Float32Array;
    let linesMesh: import("three").LineSegments;
    let mouseX = 0;
    let mouseY = 0;
    let targetMouseX = 0;
    let targetMouseY = 0;
    let three: typeof import("three");

    const initScene = async () => {
      // Load Three.js from CDN
      if (!window.THREE) {
        const script = document.createElement("script");
        script.src = "https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js";
        script.async = true;
        document.head.appendChild(script);

        await new Promise<void>((resolve) => {
          script.onload = () => resolve();
        });
      }

      three = window.THREE;
      setIs3DReady(true);

      // Scene setup
      scene = new three.Scene();
      scene.fog = new three.FogExp2(0x000000, 0.015);

      // Camera
      const aspect = window.innerWidth / window.innerHeight;
      camera = new three.PerspectiveCamera(75, aspect, 0.1, 1000);
      camera.position.z = 50;

      // Renderer
      renderer = new three.WebGLRenderer({
        canvas: canvasRef.current!,
        antialias: true,
        alpha: true,
      });
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setClearColor(0x000000, 1);

      // Electric green color
      const electricGreen = 0x00ff41;
      const particleColor = new three.Color(electricGreen);

      // Create particles - 400 particles for optimal 60fps
      const particleCount = 400;
      particles = [];
      particlePositions = new Float32Array(particleCount * 3);

      for (let i = 0; i < particleCount; i++) {
        const particle: Particle = {
          x: (Math.random() - 0.5) * 100,
          y: (Math.random() - 0.5) * 60,
          z: (Math.random() - 0.5) * 50,
          vx: (Math.random() - 0.5) * 0.02,
          vy: (Math.random() - 0.5) * 0.02,
          vz: (Math.random() - 0.5) * 0.02,
          baseX: 0,
          baseY: 0,
          baseZ: 0,
        };
        particle.baseX = particle.x;
        particle.baseY = particle.y;
        particle.baseZ = particle.z;
        particles.push(particle);

        particlePositions[i * 3] = particle.x;
        particlePositions[i * 3 + 1] = particle.y;
        particlePositions[i * 3 + 2] = particle.z;
      }

      // Particle geometry and material
      const geometry = new three.BufferGeometry();
      geometry.setAttribute("position", new three.BufferAttribute(particlePositions, 3));

      const material = new three.PointsMaterial({
        color: electricGreen,
        size: 0.8,
        transparent: true,
        opacity: 0.8,
        sizeAttenuation: true,
      });

      const particleSystem = new three.Points(geometry, material);
      scene.add(particleSystem);

      // Connection lines
      const maxConnections = 3000;
      linePositions = new Float32Array(maxConnections * 6);
      const lineGeometry = new three.BufferGeometry();
      lineGeometry.setAttribute("position", new three.BufferAttribute(linePositions, 3));

      const lineMaterial = new three.LineBasicMaterial({
        color: electricGreen,
        transparent: true,
        opacity: 0.15,
      });

      linesMesh = new three.LineSegments(lineGeometry, lineMaterial);
      scene.add(linesMesh);

      // Ambient rotation group
      const rotationGroup = new three.Group();
      rotationGroup.add(particleSystem);
      rotationGroup.add(linesMesh);
      scene.add(rotationGroup);

      // Animation loop
      let time = 0;
      const connectionDistance = 15;
      const mouseInfluenceRadius = 20;
      const mouseForce = 2;

      const animate = () => {
        animationId = requestAnimationFrame(animate);
        time += 0.001;

        // Smooth mouse interpolation
        targetMouseX += (mouseX - targetMouseX) * 0.05;
        targetMouseY += (mouseY - targetMouseY) * 0.05;

        // Rotate the entire group slowly
        rotationGroup.rotation.y += 0.0005;
        rotationGroup.rotation.x = targetMouseY * 0.05;
        rotationGroup.rotation.z = targetMouseX * 0.03;

        // Update particles
        let lineIndex = 0;
        let connectionCount = 0;

        for (let i = 0; i < particleCount; i++) {
          const p = particles[i];

          // Subtle floating motion
          p.x += p.vx;
          p.y += p.vy;
          p.z += p.vz;

          // Boundary check - wrap around
          if (Math.abs(p.x) > 50) p.vx *= -1;
          if (Math.abs(p.y) > 30) p.vy *= -1;
          if (Math.abs(p.z) > 25) p.vz *= -1;

          // Mouse interaction - push particles away
          const mouseWorldX = targetMouseX * 40;
          const mouseWorldY = -targetMouseY * 25;

          const dx = p.x - mouseWorldX;
          const dy = p.y - mouseWorldY;
          const dz = p.z;
          const distToMouse = Math.sqrt(dx * dx + dy * dy + dz * dz);

          if (distToMouse < mouseInfluenceRadius) {
            const force = (1 - distToMouse / mouseInfluenceRadius) * mouseForce;
            p.vx += (dx / distToMouse) * force * 0.1;
            p.vy += (dy / distToMouse) * force * 0.1;
          }

          // Damping - return to base position slowly
          p.vx += (p.baseX - p.x) * 0.001;
          p.vy += (p.baseY - p.y) * 0.001;
          p.vz += (p.baseZ - p.z) * 0.001;

          // Apply velocity with damping
          p.vx *= 0.99;
          p.vy *= 0.99;
          p.vz *= 0.99;

          // Update position
          p.x += p.vx;
          p.y += p.vy;
          p.z += p.vz;

          particlePositions[i * 3] = p.x;
          particlePositions[i * 3 + 1] = p.y;
          particlePositions[i * 3 + 2] = p.z;

          // Check connections
          for (let j = i + 1; j < particleCount && connectionCount < maxConnections; j++) {
            const p2 = particles[j];
            const dx = p.x - p2.x;
            const dy = p.y - p2.y;
            const dz = p.z - p2.z;
            const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

            if (dist < connectionDistance) {
              const opacity = (1 - dist / connectionDistance) * 0.3;

              linePositions[lineIndex++] = p.x;
              linePositions[lineIndex++] = p.y;
              linePositions[lineIndex++] = p.z;
              linePositions[lineIndex++] = p2.x;
              linePositions[lineIndex++] = p2.y;
              linePositions[lineIndex++] = p2.z;

              connectionCount++;
            }
          }
        }

        // Update geometry
        geometry.attributes.position.needsUpdate = true;

        // Clear remaining line positions
        for (let i = lineIndex; i < linePositions.length; i++) {
          linePositions[i] = 0;
        }
        lineGeometry.attributes.position.needsUpdate = true;

        renderer.render(scene, camera);
      };

      animate();

      // Mouse event handler
      const handleMouseMove = (event: MouseEvent) => {
        // Normalize mouse to -1 to +1 range (NDC space)
        mouseX = (event.clientX / window.innerWidth) * 2 - 1;
        mouseY = (event.clientY / window.innerHeight) * 2 - 1;
      };

      // Resize handler
      const handleResize = () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      };

      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("resize", handleResize);

      // Cleanup function
      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("resize", handleResize);
        cancelAnimationFrame(animationId);
        renderer.dispose();
        geometry.dispose();
        material.dispose();
        lineGeometry.dispose();
        lineMaterial.dispose();
      };
    };

    initScene();
  }, []);

  // GSAP text animations
  useEffect(() => {
    if (!contentRef.current || !is3DReady) return;

    // Small delay to let 3D initialize first
    const tl = gsap.timeline({ delay: 0.3 });

    // Eyebrow fades in
    tl.fromTo(
      ".hero-eyebrow",
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: "power3.out" }
    );

    // H1 words stagger up with more dramatic effect
    tl.fromTo(
      ".hero-heading",
      { y: 80, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.2, stagger: 0.2, ease: "power3.out" },
      "-=0.5"
    );

    // Subline
    tl.fromTo(
      ".hero-subline",
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" },
      "-=0.6"
    );

    // CTA button
    tl.fromTo(
      ".hero-cta",
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" },
      "-=0.4"
    );

    // Scroll indicator
    tl.fromTo(
      ".hero-scroll",
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" },
      "-=0.3"
    );
  }, [is3DReady]);

  return (
    <section
      ref={containerRef}
      className="relative h-screen w-full overflow-hidden bg-black"
    >
      {/* 3D Canvas - Background Layer */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full z-0"
        style={{ 
          opacity: is3DReady ? 1 : 0,
          transition: 'opacity 1.5s ease-in-out'
        }}
      />

      {/* Dark Gradient Overlay - for text readability */}
      <div 
        className="absolute inset-0 z-[1] pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.7) 100%)'
        }}
      />

      {/* Content Layer */}
      <div
        ref={contentRef}
        className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center px-6"
      >
        {/* Eyebrow - Electric Green */}
        <p className="hero-eyebrow text-xs tracking-[0.3em] uppercase mb-6 font-body animate-fade-in"
           style={{ color: '#00ff41' }}>
          India's Most Culturally Wired Agency
        </p>

        {/* Main Headline - White/Light */}
        <h1 className="font-display text-[clamp(3rem,9vw,8rem)] font-light leading-[0.9] mb-6 tracking-tight">
          <span className="hero-heading block text-white">We Don't Just Post.</span>
          <span className="hero-heading block text-white">We Make People</span>
          <span className="hero-heading block" style={{ color: '#00ff41' }}>Feel.</span>
        </h1>

        {/* Subline - Muted */}
        <p className="hero-subline text-sm text-white/40 tracking-[0.2em] mb-10 font-body uppercase">
          Social Media · Content · Growth
        </p>

        {/* CTA Button - Electric Green */}
        <button 
          className="hero-cta px-10 py-4 rounded-full text-sm tracking-[0.15em] transition-all duration-500 font-body uppercase"
          style={{ 
            border: '1px solid #00ff41',
            background: 'transparent',
            color: '#00ff41'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#00ff41';
            e.currentTarget.style.color = '#000000';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent';
            e.currentTarget.style.color = '#00ff41';
          }}
        >
          Start Growing →
        </button>
      </div>

      {/* Scroll Indicator */}
      <div className="hero-scroll absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center">
        <div className="w-px h-12 bg-white/10 relative overflow-hidden">
          <div 
            className="absolute top-0 w-full h-1/2 animate-scroll-line"
            style={{ background: '#00ff41' }}
          />
        </div>
        <span 
          className="text-xs mt-2 tracking-[0.3em] font-body uppercase"
          style={{ color: '#00ff41' }}
        >
          Scroll
        </span>
      </div>

      <style jsx>{`
        @keyframes scroll-line {
          0% {
            transform: translateY(-100%);
          }
          100% {
            transform: translateY(200%);
          }
        }
        .animate-scroll-line {
          animation: scroll-line 2s cubic-bezier(0.77, 0, 0.175, 1) infinite;
        }
      `}</style>
    </section>
  );
}
