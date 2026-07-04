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
      // Made the scroll height longer for more steps (end: "+=350%")
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: "top top",
          end: "+=350%",
          scrub: 1,
          pin: true,
          anticipatePin: 1,
        },
      });

      // Horizontal parallax translations
      tl.to(layerBackRef.current, { xPercent: -25, ease: "none" }, 0)
        .to(layerMidBackRef.current, { xPercent: -45, ease: "none" }, 0)
        .to(layerMidFrontRef.current, { xPercent: -65, ease: "none" }, 0)
        .to(layerFrontRef.current, { xPercent: -85, ease: "none" }, 0);

      // Animate SUV car silhouette across the road path in sync with scroll
      tl.to("#car", { x: 1300, y: -15, ease: "none" }, 0);

      // Animate steps in sequence (5 steps total now)
      const steps = gsap.utils.toArray<HTMLElement>(".journey-step");
      steps.forEach((step, i) => {
        tl.fromTo(
          step,
          { opacity: 0, y: 35 },
          { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
          i * 0.7
        );
        if (i < steps.length - 1) {
          tl.to(step, { opacity: 0, y: -35, duration: 0.4, ease: "power2.in" }, (i + 1) * 0.7 - 0.1);
        }
      });
    }, container);

    return () => ctx.revert();
  }, []);

  const renderPines = () => {
    const pines = [];
    const stepCount = 80; // Extended forest density for longer road
    for (let i = 0; i < stepCount; i++) {
      const x = i * 40 + 20;
      const hillY = 460 + Math.sin(x * 0.003) * 35;
      const scale = 0.6 + Math.random() * 0.7;
      pines.push(
        <g key={i} transform={`translate(${x}, ${hillY}) scale(${scale})`}>
          <polygon points="0,-35 -10,-15 -4,-15 -14,5 -6,5 -18,25 18,25 6,5 14,5 4,-15 10,-15" fill="#6d5741" />
          <polygon points="0,-35 -6,-15 -3,-15 -9,5 -4,5 -12,25 12,25 4,5 9,5 3,-15 6,-15" fill="#7d6751" />
        </g>
      );
    }
    return pines;
  };

  return (
    <section ref={containerRef} className={styles.parallaxSection}>
      {/* Layer 1: Back Peaks with flying eagles */}
      <div ref={layerBackRef} className={`${styles.layer} ${styles.layerBack}`}>
        <svg viewBox="0 0 2400 600" fill="none" xmlns="http://www.w3.org/2000/svg" className={styles.svg} preserveAspectRatio="none">
          <path d="M0 600V380L150 260L350 410L550 300L750 440L950 210L1150 350L1350 170L1550 340L1750 240L1950 360L2150 220L2400 350V600H0Z" fill="#C5B59E" opacity="0.3" />
          {/* Flying Eagle silhouettes in the sky */}
          <path d="M400 120 Q410 115 420 120 Q435 110 450 120" stroke="#C5B59E" strokeWidth="2" strokeLinecap="round" fill="none" />
          <path d="M1200 80 Q1210 75 1220 80 Q1235 70 1250 80" stroke="#C5B59E" strokeWidth="2" strokeLinecap="round" fill="none" />
        </svg>
      </div>

      {/* Layer 2: Forest Hills */}
      <div ref={layerMidBackRef} className={`${styles.layer} ${styles.layerMidBack}`}>
        <svg viewBox="0 0 2400 600" fill="none" xmlns="http://www.w3.org/2000/svg" className={styles.svg} preserveAspectRatio="none">
          <path d="M0 600V480Q400 400 800 480T1600 420T2400 480V600H0Z" fill="#8d7761" opacity="0.5" />
          {renderPines()}
        </svg>
      </div>

      {/* Layer 3: Coastline and Light beam */}
      <div ref={layerMidFrontRef} className={`${styles.layer} ${styles.layerMidFront}`}>
        <svg viewBox="0 0 2400 600" fill="none" xmlns="http://www.w3.org/2000/svg" className={styles.svg} preserveAspectRatio="none">
          <defs>
            <linearGradient id="beamGrad" x1="0" y1="0.5" x2="1" y2="0.5">
              <stop offset="0%" stopColor="#A9843D" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#FAF7F0" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d="M0 600V510Q200 460 500 500T1000 430T1600 490T2400 430V600H0Z" fill="#1B3A4B" />
          
          {/* Lighthouse */}
          <g transform="translate(1400, 230)">
            <rect x="-15" y="120" width="30" height="90" fill="#1B3A4B" stroke="#A9843D" strokeWidth="1.5" />
            <polygon points="-12,120 -8,15 8,15 12,120" fill="#FAF7F0" stroke="#1B3A4B" strokeWidth="2" />
            <rect x="-14" y="15" width="28" height="6" fill="#1B3A4B" />
            <polygon points="-8,15 -8,0 8,0 8,15" fill="#FAF7F0" />
            <polygon points="-8,0 0,-15 8,0" fill="#C1663E" />
            <polygon points="0,-8 500,-120 500,40" fill="url(#beamGrad)" className={styles.lightBeam} />
          </g>
        </svg>
      </div>

      {/* Layer 4: Highway and Animated SUV */}
      <div ref={layerFrontRef} className={`${styles.layer} ${styles.layerFront}`}>
        <svg viewBox="0 0 2400 600" fill="none" xmlns="http://www.w3.org/2000/svg" className={styles.svg} preserveAspectRatio="none">
          {/* Main Road strip */}
          <path d="M0 600C500 580 1000 570 1500 580C2000 590 2200 585 2400 600H0Z" fill="#14201F" />
          <path d="M0 580Q500 540 1000 555T2000 545T2400 570" stroke="#A9843D" strokeWidth="4" strokeDasharray="14 14" fill="none" />

          {/* Animated SUV group: translates along the path */}
          <g id="car" transform="translate(100, 530) scale(0.65)">
            {/* Dodge Durango silhouette */}
            <path d="M0,15 L5,8 L15,8 L25,0 L50,0 L65,15 L70,22 L70,30 L0,30 Z" fill="#C1663E" stroke="#FAF7F0" strokeWidth="1.5" />
            {/* Windows */}
            <path d="M15,9 L23,3 L35,3 L35,9 Z" fill="#14201F" />
            <path d="M38,3 L48,3 L46,9 L38,9 Z" fill="#14201F" />
            {/* Wheels */}
            <circle cx="15" cy="30" r="7" fill="#14201F" stroke="#A9843D" strokeWidth="1.5" />
            <circle cx="55" cy="30" r="7" fill="#14201F" stroke="#A9843D" strokeWidth="1.5" />
          </g>
        </svg>
      </div>

      {/* Editorial Steps overlay */}
      <div ref={textRef} className={styles.contentOverlay}>
        <div className={`${styles.journeyStep} journey-step`}>
          <span className="mono-label">LOGBOOK // 06:15 AM</span>
          <h2 className={styles.stepTitle}>Fog lifts over the lake.</h2>
          <p className={styles.stepDesc}>
            The day begins on the quiet shores of the Bras d&apos;Or inland sea, 
            where the morning mist slowly burns off the salt water.
          </p>
        </div>

        <div className={`${styles.journeyStep} journey-step`}>
          <span className="mono-label">LOGBOOK // 11:30 AM</span>
          <h2 className={styles.stepTitle}>Ascending Cape Smokey.</h2>
          <p className={styles.stepDesc}>
            The road climbs 1,200 feet above the coast, opening up panoramic 
            views of the infinite blue Atlantic stretching toward Europe.
          </p>
        </div>

        <div className={`${styles.journeyStep} journey-step`}>
          <span className="mono-label">LOGBOOK // 04:45 PM</span>
          <h2 className={styles.stepTitle}>The wind at Green Cove.</h2>
          <p className={styles.stepDesc}>
            Hear the crash of ocean swells against the ancient pink granite rocks 
            on Cape Breton&apos;s wild eastern coastline.
          </p>
        </div>

        <div className={`${styles.journeyStep} journey-step`}>
          <span className="mono-label">LOGBOOK // 07:15 PM</span>
          <h2 className={styles.stepTitle}>Sunset at Chéticamp.</h2>
          <p className={styles.stepDesc}>
            Trace the Acadian shoreline as the sun dips below the Gulf of St. Lawrence, 
            painting the sky in deep terracottas.
          </p>
        </div>

        <div className={`${styles.journeyStep} journey-step`}>
          <span className="mono-label">LOGBOOK // 10:00 PM</span>
          <h2 className={styles.stepTitle}>Highlands stargazing.</h2>
          <p className={styles.stepDesc}>
            Park under the pitch-black sky of the national park. The stars are so 
            bright they reflect off the hood of the vehicle.
          </p>
        </div>
      </div>
    </section>
  );
}
