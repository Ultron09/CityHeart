"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import styles from "./CruiseWaterTank.module.css";

export default function CruiseWaterTank() {
  const tankRef = useRef<HTMLDivElement>(null);
  const waterRef = useRef<SVGPathElement>(null);
  const [statusText, setStatusText] = useState("VESSEL APPROACHING...");
  const [showVoucher, setShowVoucher] = useState(false);

  useEffect(() => {
    const water = waterRef.current;
    if (!water) return;

    // 1. Wavy water tide animation (continuous loop)
    let count = 0;
    const waveAnimation = setInterval(() => {
      count += 0.08;
      const waveOffset = Math.sin(count) * 6;
      if (water) {
        // Morph wave bezier curve slightly over time
        water.setAttribute(
          "d",
          `M0,${150 + waveOffset} Q150,${135 - waveOffset} 300,${150 + waveOffset} L300,300 L0,300 Z`
        );
      }
    }, 45);

    // 2. GSAP timeline: Fills the water tank, verifies docking, then drains/reveals
    const tl = gsap.timeline({
      delay: 0.5,
      onComplete: () => {
        clearInterval(waveAnimation);
      }
    });

    // Rise water level
    tl.to("#waterGroup", {
      y: -140,
      duration: 3.2,
      ease: "power2.out",
      onStart: () => setStatusText("DOCKING IN PROGRESS..."),
    })
    // Ship drops anchor
    .to("#anchor", {
      y: 75,
      opacity: 1,
      duration: 0.8,
      ease: "bounce.out",
      onStart: () => setStatusText("ANCHOR DROPPED // STABILIZING"),
    }, "-=1.0")
    // Sparkle effect
    .to("#lockBadge", {
      scale: 1.15,
      opacity: 1,
      duration: 0.4,
      ease: "back.out(2)",
      onComplete: () => setStatusText("SECURED // WORRY-FREE PROMISE ACTIVE"),
    })
    // Pause briefly
    .to({}, { duration: 1.5 })
    // Rapid drain!
    .to("#waterGroup", {
      y: 280,
      duration: 1.4,
      ease: "power2.in",
      onStart: () => setStatusText("HARBOUR DOCKING VERIFIED"),
      onComplete: () => {
        setShowVoucher(true);
      }
    })
    // Hide anchor
    .to("#anchor", {
      opacity: 0,
      duration: 0.4
    }, "-=1.2");

    return () => {
      clearInterval(waveAnimation);
      tl.kill();
    };
  }, []);

  return (
    <div ref={tankRef} className={styles.container}>
      <div className={styles.tankFrame}>
        {/* Outer Brass double-frame border */}
        <div className="brass-double-frame" style={{ width: "100%", height: "100%" }}>
          <div className="brass-double-frame-inner" style={{ background: "#14201F", overflow: "hidden", position: "relative", height: "300px" }}>
            
            {/* Status log header */}
            <div className={styles.header}>
              <span className="mono-label">SYDNEY PORT TELEMETRY</span>
              <div className={styles.statusBar}>
                <span className={styles.statusDot}></span>
                <span className={styles.statusText}>{statusText}</span>
              </div>
            </div>

            {/* Hidden Voucher that is revealed after the water drains */}
            <div className={`${styles.voucher} ${showVoucher ? styles.voucherActive : ""}`}>
              <span className={styles.voucherBadge}>PORT VERIFIED</span>
              <h3 className={styles.voucherTitle}>Worry-Free Return Guarantee</h3>
              <p className={styles.voucherDesc}>
                We guarantee to return you to your cruise vessel 1 hour before all-aboard, 
                or we will cover your transit costs to the next port of call.
              </p>
              <div className={styles.voucherStamp}>CHT // Joan Harriss Pavilion</div>
            </div>

            {/* SVG Interactive Ocean Chamber */}
            <svg viewBox="0 0 300 300" className={styles.svg}>
              <defs>
                {/* Blue-Green Harbour Water Gradient */}
                <linearGradient id="waterGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#1B3A4B" stopOpacity="0.85" />
                  <stop offset="100%" stopColor="#0B1A24" stopOpacity="0.95" />
                </linearGradient>
              </defs>

              {/* Ship outline silhouette */}
              <g transform="translate(100, 70) scale(0.7)">
                {/* Ship hull */}
                <path d="M0,45 L15,45 L25,18 L90,18 L100,45 L115,45 L125,58 L105,78 L15,78 Z" fill="#A9843D" opacity="0.35" />
                <rect x="35" y="0" width="45" height="18" fill="#FAF7F0" opacity="0.25" />
                {/* Funnel smoke */}
                <circle cx="50" cy="-8" r="4" fill="#A9843D" opacity="0.15" />
                <circle cx="54" cy="-18" r="6" fill="#A9843D" opacity="0.08" />
              </g>

              {/* Dropping Anchor */}
              <g id="anchor" transform="translate(150, 40)" style={{ opacity: 0 }}>
                <line x1="0" y1="-40" x2="0" y2="30" stroke="#A9843D" strokeWidth="1.5" strokeDasharray="3 3" />
                <circle cx="0" cy="30" r="5" fill="none" stroke="#A9843D" strokeWidth="2" />
                <path d="M-10,30 C-10,45 10,45 10,30" fill="none" stroke="#A9843D" strokeWidth="2" />
                <line x1="-12" y1="30" x2="12" y2="30" stroke="#A9843D" strokeWidth="2" />
              </g>

              {/* Water Group: rising/filling */}
              <g id="waterGroup" transform="translate(0, 260)">
                {/* Wavy surface path */}
                <path ref={waterRef} d="M0,150 Q150,135 300,150 L300,300 L0,300 Z" fill="url(#waterGrad)" />
                {/* Dynamic Bubbles inside water */}
                <circle cx="40" cy="180" r="3" fill="#FAF7F0" opacity="0.4" className={styles.bubble1} />
                <circle cx="120" cy="220" r="4" fill="#FAF7F0" opacity="0.3" className={styles.bubble2} />
                <circle cx="200" cy="190" r="2.5" fill="#FAF7F0" opacity="0.5" className={styles.bubble3} />
                <circle cx="260" cy="230" r="3.5" fill="#FAF7F0" opacity="0.3" className={styles.bubble4} />
              </g>

              {/* Safe Lock Shield indicator */}
              <g id="lockBadge" transform="translate(150, 150)" style={{ opacity: 0, transformOrigin: "center" }}>
                <circle cx="0" cy="0" r="22" fill="#FAF7F0" stroke="#A9843D" strokeWidth="1.5" />
                <path d="M-8,-4 L8,-4 L8,8 C8,12 0,16 0,16 C0,16 -8,12 -8,8 Z" fill="#C1663E" />
                <path d="M-4,-4 L-4,-8 C-4,-12 4,-12 4,-8 L4,-4" fill="none" stroke="#FAF7F0" strokeWidth="1.5" />
              </g>
            </svg>

          </div>
        </div>
      </div>
    </div>
  );
}
