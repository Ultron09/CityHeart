"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import styles from "./SubmersionTransition.module.css";

export default function SubmersionTransition() {
  const overlayRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const turbulenceRef = useRef<SVGFETurbulenceElement>(null);
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    const overlay = overlayRef.current;
    const content = contentRef.current;
    const turb = turbulenceRef.current;
    if (!overlay || !content) return;

    // 1. Wobbly liquid ripple animation (morph turbulence base frequency dynamically)
    let timelineTurb: gsap.core.Tween | null = null;
    if (turb) {
      timelineTurb = gsap.to(turb, {
        attr: { baseFrequency: "0.02 0.035" },
        duration: 8,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });
    }

    // 2. Viewport flood, submerge, and drain timeline
    const tl = gsap.timeline({
      onComplete: () => {
        setIsActive(false); // Clean up from DOM when finished
        if (timelineTurb) timelineTurb.kill();
      }
    });

    // Rise tide to flood screen
    tl.fromTo(
      overlay,
      { yPercent: 100 },
      {
        yPercent: 0,
        duration: 1.5,
        ease: "power2.out",
      }
    )
    // Dynamic text slide in
    .fromTo(
      content,
      { opacity: 0, scale: 0.96 },
      {
        opacity: 1,
        scale: 1,
        duration: 0.65,
        ease: "power2.out",
      },
      "-=0.5"
    )
    // Keep screen submerged briefly
    .to({}, { duration: 2.2 })
    // Fade out text
    .to(content, {
      opacity: 0,
      y: -25,
      duration: 0.55,
      ease: "power2.in"
    })
    // Pull water downwards to drain
    .to(overlay, {
      yPercent: -100,
      duration: 1.5,
      ease: "power3.inOut"
    });

    return () => {
      tl.kill();
      if (timelineTurb) timelineTurb.kill();
    };
  }, []);

  if (!isActive) return null;

  return (
    <div ref={overlayRef} className={styles.overlay}>
      
      {/* 1. SVG fractal noise liquid distortion filter definitions */}
      <svg className={styles.filterSvg}>
        <defs>
          <filter id="liquidWaterRipple">
            <feTurbulence
              ref={turbulenceRef}
              type="fractalNoise"
              baseFrequency="0.015 0.02"
              numOctaves="3"
              result="noise"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale="20"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>
      </svg>

      {/* Realistic shimmering water caustics overlay grid */}
      <div className={styles.causticsOverlay} />
      
      {/* Subtle depth lighting layers */}
      <div className={styles.sunRays} />

      {/* Floating bubbles */}
      <div className={styles.bubbleArea}>
        <div className={styles.bubble}></div>
        <div className={styles.bubble}></div>
        <div className={styles.bubble}></div>
        <div className={styles.bubble}></div>
        <div className={styles.bubble}></div>
      </div>

      {/* Viewport Submersion Message (Distorted through liquid filter) */}
      <div ref={contentRef} className={styles.content}>
        <span className="mono-label" style={{ color: "#FAF7F0", opacity: 0.85 }}>DOCKING VERIFIED</span>
        <h2 className={styles.title}>Submerging to Sydney Port...</h2>
        <p className={styles.coords}>LAT 46.1387° N // LON 60.1934° W</p>
        
        {/* Wavy tide lines icon */}
        <div className={styles.wavesIcon}>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>

    </div>
  );
}
