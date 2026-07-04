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

    // Horizontal sliding parallax trigger pinned to viewport scroll
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: "top top",
          end: "+=200%", // Scroll depth duration
          scrub: 1,      // Smooth scrubbing
          pin: true,     // Lock section in viewport
          anticipatePin: 1,
        },
      });

      // Animate layers at different offset rates
      tl.to(layerBackRef.current, { xPercent: -15, ease: "none" }, 0)
        .to(layerMidBackRef.current, { xPercent: -30, ease: "none" }, 0)
        .to(layerMidFrontRef.current, { xPercent: -45, ease: "none" }, 0)
        .to(layerFrontRef.current, { xPercent: -60, ease: "none" }, 0);

      // Animate editorial text fragments faded in/out in sequence
      const textBlocks = gsap.utils.toArray<HTMLElement>(".journey-step");
      textBlocks.forEach((text, i) => {
        tl.fromTo(
          text,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.5, stagger: 0.1 },
          (i * 0.5) // staggered entry point in timeline
        );
        if (i < textBlocks.length - 1) {
          tl.to(text, { opacity: 0, y: -30, duration: 0.3 }, (i + 1) * 0.5 - 0.1);
        }
      });
    }, container);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className={styles.parallaxSection}>
      {/* Background Mountain range SVG */}
      <div ref={layerBackRef} className={`${styles.layer} ${styles.layerBack}`}>
        <svg viewBox="0 0 1440 600" fill="none" xmlns="http://www.w3.org/2000/svg" className={styles.svg}>
          <path d="M0 600V420L180 320L360 480L540 380L720 460L900 280L1080 390L1260 210L1440 350V600H0Z" fill="#C5B59E" opacity="0.4" />
        </svg>
      </div>

      {/* Middle-Back Highlands Hills SVG */}
      <div ref={layerMidBackRef} className={`${styles.layer} ${styles.layerMidBack}`}>
        <svg viewBox="0 0 1440 600" fill="none" xmlns="http://www.w3.org/2000/svg" className={styles.svg}>
          <path d="M0 600V480L200 420L450 510L700 390L950 490L1200 370L1440 460V600H0Z" fill="#9A826A" opacity="0.6" />
        </svg>
      </div>

      {/* Middle-Front Atlantic Coast Cliffs & Lighthouse SVG */}
      <div ref={layerMidFrontRef} className={`${styles.layer} ${styles.layerMidFront}`}>
        <svg viewBox="0 0 1440 600" fill="none" xmlns="http://www.w3.org/2000/svg" className={styles.svg}>
          <path d="M0 600V520L300 470L600 540L900 430L1200 510L1440 450V600H0Z" fill="#1B3A4B" />
          {/* Stylized Lighthouse outline */}
          <rect x="900" y="320" width="30" height="110" fill="#1B3A4B" />
          <polygon points="900,320 915,290 930,320" fill="#A9843D" />
        </svg>
      </div>

      {/* Front Winding Road SVG */}
      <div ref={layerFrontRef} className={`${styles.layer} ${styles.layerFront}`}>
        <svg viewBox="0 0 1440 600" fill="none" xmlns="http://www.w3.org/2000/svg" className={styles.svg}>
          <path d="M0 600C300 590 600 580 900 590C1200 600 1350 590 1440 600H0Z" fill="#14201F" />
          <path d="M0 580Q250 540 500 560T1000 550T1440 570" stroke="#A9843D" strokeWidth="3" strokeDasharray="10 10" fill="none" />
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
