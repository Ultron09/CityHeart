"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import styles from "./SubmersionTransition.module.css";

export default function SubmersionTransition() {
  const overlayRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    const overlay = overlayRef.current;
    const content = contentRef.current;
    if (!overlay || !content) return;

    // Viewport-height flood & drain timeline
    const tl = gsap.timeline({
      onComplete: () => {
        setIsActive(false); // remove from DOM
      }
    });

    // 1. Initial Flood: Rise tide to submerge screen
    tl.fromTo(
      overlay,
      { yPercent: 100 },
      {
        yPercent: 0,
        duration: 1.4,
        ease: "power3.out",
      }
    )
    // 2. Submerged text fade in
    .fromTo(
      content,
      { opacity: 0, scale: 0.95 },
      {
        opacity: 1,
        scale: 1,
        duration: 0.6,
        ease: "power2.out",
      },
      "-=0.4"
    )
    // 3. Keep submerged for a moment (immersive coordinate sonar sound waves vibe)
    .to({}, { duration: 1.8 })
    // 4. Fade out text
    .to(content, {
      opacity: 0,
      y: -30,
      duration: 0.5,
      ease: "power2.in"
    })
    // 5. Drain: Pull water downwards off the viewport
    .to(overlay, {
      yPercent: -100,
      duration: 1.4,
      ease: "power3.inOut"
    });

    return () => {
      tl.kill();
    };
  }, []);

  if (!isActive) return null;

  return (
    <div ref={overlayRef} className={styles.overlay}>
      
      {/* Dynamic Floating bubbles */}
      <div className={styles.bubbleArea}>
        <div className={styles.bubble}></div>
        <div className={styles.bubble}></div>
        <div className={styles.bubble}></div>
        <div className={styles.bubble}></div>
        <div className={styles.bubble}></div>
      </div>

      {/* Viewport Submersion Message */}
      <div ref={contentRef} className={styles.content}>
        <span className="mono-label" style={{ color: "#A9843D" }}>DOCKING ACQUISITION VERIFIED</span>
        <h2 className={styles.title}>Submerging to Sydney Port...</h2>
        <p className={styles.coords}>LAT 46.1387° N // LON 60.1934° W</p>
        <div className={styles.wavesIcon}>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>

    </div>
  );
}
