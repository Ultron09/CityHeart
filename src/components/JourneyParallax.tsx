"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./JourneyParallax.module.css";

gsap.registerPlugin(ScrollTrigger);

export default function JourneyParallax() {
  const containerRef = useRef<HTMLDivElement>(null);
  const layerBackRef = useRef<HTMLDivElement>(null);
  const layerMidBackRef = useRef<HTMLDivElement>(null);
  const layerMidFrontRef = useRef<HTMLDivElement>(null);
  const layerFrontRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: "top top",
          end: "+=220%",
          scrub: 1.2,
          pin: true,
          anticipatePin: 1,
        },
      });

      // Offset horizontal speed parameters for deep multi-layered parallax
      tl.to(layerBackRef.current, { xPercent: -18, ease: "none" }, 0)
        .to(layerMidBackRef.current, { xPercent: -32, ease: "none" }, 0)
        .to(layerMidFrontRef.current, { xPercent: -48, ease: "none" }, 0)
        .to(layerFrontRef.current, { xPercent: -64, ease: "none" }, 0);

      // Editorial step triggers fading in sequence
      const steps = gsap.utils.toArray<HTMLElement>(".journey-step");
      steps.forEach((step, i) => {
        tl.fromTo(
          step,
          { opacity: 0, y: 35 },
          { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
          i * 0.6
        );
        if (i < steps.length - 1) {
          tl.to(step, { opacity: 0, y: -35, duration: 0.4, ease: "power2.in" }, (i + 1) * 0.6 - 0.1);
        }
      });
    }, container);

    return () => ctx.revert();
  }, []);

  // Generate procedural forest coordinate offsets to render high-detail pine silhouettes
  const renderPines = () => {
    const pines = [];
    const stepCount = 50; // 50 individual vector trees
    for (let i = 0; i < stepCount; i++) {
      const x = i * 42 + 20;
      // Rolling hill sine-wave path calculation
      const hillY = 460 + Math.sin(x * 0.004) * 35;
      const scale = 0.7 + Math.random() * 0.6;
      pines.push(
        <g key={i} transform={`translate(${x}, ${hillY}) scale(${scale})`}>
          {/* Detailed layered pine tree path */}
          <polygon points="0,-35 -10,-15 -4,-15 -14,5 -6,5 -18,25 18,25 6,5 14,5 4,-15 10,-15" fill="#7d6751" />
          <polygon points="0,-35 -6,-15 -3,-15 -9,5 -4,5 -12,25 12,25 4,5 9,5 3,-15 6,-15" fill="#8d7761" />
        </g>
      );
    }
    return pines;
  };

  return (
    <section ref={containerRef} className={styles.parallaxSection}>
      {/* Layer 1: Back Mountain Peaks (Soft silhouette) */}
      <div ref={layerBackRef} className={`${styles.layer} ${styles.layerBack}`}>
        <svg viewBox="0 0 1600 600" fill="none" xmlns="http://www.w3.org/2000/svg" className={styles.svg} preserveAspectRatio="none">
          <path d="M0 600V380L120 280L280 410L420 320L620 440L820 230L990 350L1180 180L1380 340L1480 260L1600 360V600H0Z" fill="#C5B59E" opacity="0.35" />
        </svg>
      </div>

      {/* Layer 2: Middle-Back Forest Hills (Procedural Pines) */}
      <div ref={layerMidBackRef} className={`${styles.layer} ${styles.layerMidBack}`}>
        <svg viewBox="0 0 1600 600" fill="none" xmlns="http://www.w3.org/2000/svg" className={styles.svg} preserveAspectRatio="none">
          <path d="M0 600V480Q300 410 600 480T1200 430T1600 480V600H0Z" fill="#9A826A" opacity="0.55" />
          {/* Render our detailed custom forest */}
          {renderPines()}
        </svg>
      </div>

      {/* Layer 3: Middle-Front Coastline, Lighthouse & Lightbeam */}
      <div ref={layerMidFrontRef} className={`${styles.layer} ${styles.layerMidFront}`}>
        <svg viewBox="0 0 1600 600" fill="none" xmlns="http://www.w3.org/2000/svg" className={styles.svg} preserveAspectRatio="none">
          {/* Definitions for warm radial glow beam */}
          <defs>
            <linearGradient id="beamGrad" x1="0" y1="0.5" x2="1" y2="0.5">
              <stop offset="0%" stopColor="#A9843D" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#FAF7F0" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Jagged rocky coastline */}
          <path d="M0 600V510Q180 470 380 505T800 440T1200 495T1600 430V600H0Z" fill="#1B3A4B" />
          
          {/* Low Point Lighthouse Detail */}
          <g transform="translate(1000, 230)">
            {/* Base block */}
            <rect x="-15" y="120" width="30" height="90" fill="#1B3A4B" stroke="#A9843D" strokeWidth="1.5" />
            {/* Tapered tower */}
            <polygon points="-12,120 -8,15 8,15 12,120" fill="#FAF7F0" stroke="#1B3A4B" strokeWidth="2" />
            {/* Gallery Deck rail */}
            <rect x="-14" y="15" width="28" height="6" fill="#1B3A4B" />
            {/* Lantern room cap */}
            <polygon points="-8,15 -8,0 8,0 8,15" fill="#FAF7F0" />
            <polygon points="-8,0 0,-15 8,0" fill="#C1663E" />
            
            {/* Rotating glowing lamp beam */}
            <polygon points="0,-8 500,-120 500,40" fill="url(#beamGrad)" className={styles.lightBeam} />
          </g>
        </svg>
      </div>

      {/* Layer 4: Front Winding Highway */}
      <div ref={layerFrontRef} className={`${styles.layer} ${styles.layerFront}`}>
        <svg viewBox="0 0 1600 600" fill="none" xmlns="http://www.w3.org/2000/svg" className={styles.svg} preserveAspectRatio="none">
          {/* Solid highway shape */}
          <path d="M0 600C400 585 800 575 1200 585C1400 595 1520 588 1600 600H0Z" fill="#14201F" />
          {/* Perspective dashed yellow line */}
          <path d="M0 580Q400 545 800 560T1600 570" stroke="#A9843D" strokeWidth="4" strokeDasharray="14 14" fill="none" />
        </svg>
      </div>

      {/* Editorial Content Overlay */}
      <div ref={textRef} className={styles.contentOverlay}>
        <div className="journey-step">
          <span className="mono-label">LOGBOOK // 06:15 AM</span>
          <h2 className={styles.stepTitle}>Fog lifts over the lake.</h2>
          <p className={styles.stepDesc}>
            The day begins on the quiet shores of the Bras d&apos;Or inland sea, 
            where the morning mist slowly burns off the salt water.
          </p>
        </div>

        <div className="journey-step">
          <span className="mono-label">LOGBOOK // 11:30 AM</span>
          <h2 className={styles.stepTitle}>Ascending Cape Smokey.</h2>
          <p className={styles.stepDesc}>
            The road climbs 1,200 feet above the coast, opening up panoramic 
            views of the infinite blue Atlantic stretching toward Europe.
          </p>
        </div>

        <div className="journey-step">
          <span className="mono-label">LOGBOOK // 04:45 PM</span>
          <h2 className={styles.stepTitle}>The wind at Green Cove.</h2>
          <p className={styles.stepDesc}>
            Hear the crash of ocean swells against the ancient pink granite rocks 
            on Cape Breton&apos;s wild eastern coastline.
          </p>
        </div>
      </div>
    </section>
  );
}
