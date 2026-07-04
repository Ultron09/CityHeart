"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import styles from "./SubmersionTransition.module.css";

export default function SubmersionTransition() {
  const containerRef = useRef<HTMLDivElement>(null);
  const waterRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const turbulenceRef = useRef<SVGFETurbulenceElement>(null);
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    const water = waterRef.current;
    const content = contentRef.current;
    const turb = turbulenceRef.current;
    if (!water || !content) return;

    // 1. Wobbly liquid ripple animation
    let timelineTurb: gsap.core.Tween | null = null;
    if (turb) {
      timelineTurb = gsap.to(turb, {
        attr: { baseFrequency: "0.025 0.04" },
        duration: 6,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });
    }

    // 2. Tank filling, swimming fish, and draining GSAP timeline
    const tl = gsap.timeline({
      onComplete: () => {
        setIsActive(false);
        if (timelineTurb) timelineTurb.kill();
      }
    });

    // Rise water level height like filling a tank (0% -> 100%)
    tl.fromTo(
      water,
      { height: "0%" },
      {
        height: "100%",
        duration: 2.2,
        ease: "power2.out",
      }
    )
    // Fade in text once screen is submerged
    .fromTo(
      content,
      { opacity: 0, scale: 0.95 },
      {
        opacity: 1,
        scale: 1,
        duration: 0.6,
        ease: "power2.out",
      },
      "-=0.6"
    )
    // Animate wiggling fish swimming left to right across the tank
    .fromTo(
      "#swimmingFish",
      { x: "-120px", y: "45vh" },
      {
        x: "105vw",
        y: "35vh",
        duration: 3.8,
        ease: "power1.inOut"
      },
      "-=1.8" // starts swimming while filling completes
    )
    // Hold submerged state briefly
    .to({}, { duration: 1.0 })
    // Fade out text before draining
    .to(content, {
      opacity: 0,
      y: -20,
      duration: 0.5,
      ease: "power2.in"
    })
    // Drain tank (100% -> 0%)
    .to(water, {
      height: "0%",
      duration: 1.8,
      ease: "power2.inOut"
    });

    return () => {
      tl.kill();
      if (timelineTurb) timelineTurb.kill();
    };
  }, []);

  if (!isActive) return null;

  const bubbles = Array.from({ length: 25 }).map((_, i) => {
    const size = 6 + Math.random() * 18;
    const left = Math.random() * 100;
    const delay = Math.random() * 4;
    const duration = 3 + Math.random() * 3;
    return (
      <div
        key={i}
        className={styles.bubble}
        style={{
          width: `${size}px`,
          height: `${size}px`,
          left: `${left}%`,
          animationDelay: `${delay}s`,
          animationDuration: `${duration}s`
        }}
      />
    );
  });

  return (
    <div ref={containerRef} className={styles.container}>
      
      {/* SVG liquid distortion filter definition */}
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
              scale="22"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>
      </svg>

      {/* The Water Tank Fill Element */}
      <div ref={waterRef} className={styles.waterFill}>
        
        {/* Shimmering caustics refracts */}
        <div className={styles.causticsOverlay} />
        <div className={styles.sunRays} />

        {/* Dynamic swimming fish */}
        <svg id="swimmingFish" width="90" height="45" className={styles.fishSvg} viewBox="0 0 100 45">
          {/* Salmon body */}
          <path d="M12,22 C32,8 65,8 82,22 C65,36 32,36 12,22 Z" fill="#A9843D" opacity="0.9" />
          {/* Dorsal Fin */}
          <path d="M42,13 L52,3 L48,14 Z" fill="#C1663E" opacity="0.9" />
          {/* Ventral Fin */}
          <path d="M50,31 L58,39 L54,30 Z" fill="#C1663E" opacity="0.8" />
          {/* Eye */}
          <circle cx="72" cy="19" r="2.2" fill="#FAF7F0" />
          <circle cx="73.5" cy="18.5" r="0.8" fill="#14201F" />
          {/* Wagging tail fin */}
          <g className={styles.tailWag}>
            <polygon points="12,22 0,10 3,22 0,34" fill="#C1663E" opacity="0.9" />
          </g>
        </svg>

        {/* Dense bubble columns rising inside the tank */}
        <div className={styles.bubbleArea}>
          {bubbles}
        </div>

        {/* Viewport Submersion Message */}
        <div ref={contentRef} className={styles.content}>
          <span className="mono-label" style={{ color: "#FAF7F0", opacity: 0.85 }}>TELEMETRY ACTIVE</span>
          <h2 className={styles.title}>Filling Sydney Port Tank...</h2>
          <p className={styles.coords}>LAT 46.1387° N // LON 60.1934° W</p>
          
          <div className={styles.wavesIcon}>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>

      </div>

    </div>
  );
}
