"use client";

import React, { useState, useRef, useEffect } from "react";
import gsap from "gsap";
import styles from "./CapeBretonMap.module.css";

// Tour pin data with approximate positions on the SVG map
const tourPins = [
  { slug: "sydney-city-lighthouse", label: "Sydney City", shortLabel: "SYD", x: 225, y: 175, color: "#C1663E" },
  { slug: "louisbourg-fortress", label: "Louisbourg Fortress", shortLabel: "LBG", x: 260, y: 220, color: "#C1663E" },
  { slug: "cabot-trail-ingonish", label: "Ingonish & Green Cove", shortLabel: "ING", x: 205, y: 65, color: "#1B3A4B" },
  { slug: "bell-museum-mini-cabot", label: "Bell Museum + Mini Cabot", shortLabel: "BEL", x: 145, y: 148, color: "#A9843D" },
  { slug: "bell-museum-highland-village", label: "Bell Museum + Highland", shortLabel: "HLV", x: 115, y: 185, color: "#A9843D" },
  { slug: "full-cabot-trail", label: "Full Cabot Trail ★", shortLabel: "CBT", x: 160, y: 82, color: "#1B3A4B", flagship: true },
  { slug: "sydney-city-lakes-lighthouse", label: "Sydney Lakes & Lighthouse", shortLabel: "LKS", x: 195, y: 195, color: "#C1663E" },
  { slug: "sydney-root-wildlife", label: "Sydney Root & Wildlife", shortLabel: "WLD", x: 175, y: 210, color: "#C1663E" },
  { slug: "iona-highland-village-tour", label: "Iona Highland Village", shortLabel: "ION", x: 125, y: 170, color: "#A9843D" },
  { slug: "alexander-bell-museum-tour", label: "Alexander Bell Museum", shortLabel: "ABM", x: 140, y: 155, color: "#A9843D" },
];

// SVG route paths connecting Sydney Port to each destination
const routePaths: Record<string, string> = {
  "sydney-city-lighthouse": "M225,175 Q235,165 240,158",
  "louisbourg-fortress": "M225,175 C240,185 250,200 260,220",
  "cabot-trail-ingonish": "M225,175 C220,145 215,110 205,65",
  "bell-museum-mini-cabot": "M225,175 C200,170 175,160 145,148",
  "bell-museum-highland-village": "M225,175 C195,180 155,185 115,185",
  "full-cabot-trail": "M225,175 C200,160 175,130 155,105 C135,80 140,60 165,55 C190,50 210,55 205,65 C200,80 185,100 175,120 C165,140 170,158 195,170 C210,175 220,175 225,175",
  "sydney-city-lakes-lighthouse": "M225,175 Q215,185 195,195",
  "sydney-root-wildlife": "M225,175 Q205,190 175,210",
  "iona-highland-village-tour": "M225,175 C195,178 160,175 125,170",
  "alexander-bell-museum-tour": "M225,175 C195,170 165,160 140,155",
};

interface CapeBretonMapProps {
  onPinHover: (slug: string | null) => void;
  onPinClick: (slug: string) => void;
  activeSlug: string | null;
}

export default function CapeBretonMap({ onPinHover, onPinClick, activeSlug }: CapeBretonMapProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [hoveredSlug, setHoveredSlug] = useState<string | null>(null);

  const currentSlug = activeSlug || hoveredSlug;

  // Animate route path drawing when hovered
  useEffect(() => {
    if (!svgRef.current) return;

    // Reset all route paths
    const allPaths = svgRef.current.querySelectorAll(`.${styles.routePath}`);
    allPaths.forEach((path) => {
      const el = path as SVGPathElement;
      const length = el.getTotalLength();
      gsap.set(el, { strokeDasharray: length, strokeDashoffset: length, opacity: 0.3 });
    });

    // Draw the active route
    if (currentSlug) {
      const activePath = svgRef.current.querySelector(`[data-route="${currentSlug}"]`) as SVGPathElement | null;
      if (activePath) {
        const length = activePath.getTotalLength();
        gsap.to(activePath, {
          strokeDashoffset: 0,
          opacity: 1,
          duration: 1.2,
          ease: "power2.out",
        });
      }

      // Pulse the active pin
      const activePin = svgRef.current.querySelector(`[data-pin="${currentSlug}"]`);
      if (activePin) {
        gsap.to(activePin, { scale: 1.4, transformOrigin: "center", duration: 0.3, ease: "back.out(2)" });
      }
    }

    // Reset non-active pins
    tourPins.forEach((pin) => {
      if (pin.slug !== currentSlug) {
        const el = svgRef.current?.querySelector(`[data-pin="${pin.slug}"]`);
        if (el) gsap.to(el, { scale: 1, duration: 0.2 });
      }
    });
  }, [currentSlug]);

  return (
    <div className={styles.mapContainer}>
      <div className={styles.mapHeader}>
        <span className="mono-label">NAVIGATION CHART // CAPE BRETON ISLAND</span>
        <p className={styles.mapInstruction}>Hover a pin to trace the route. Click to jump to details.</p>
      </div>
      
      <svg
        ref={svgRef}
        viewBox="0 0 340 280"
        className={styles.mapSvg}
        role="img"
        aria-label="Interactive map of Cape Breton Island showing tour routes"
      >
        {/* Ocean background */}
        <rect x="0" y="0" width="340" height="280" fill="#1B3A4B" opacity="0.08" rx="4" />

        {/* Latitude/Longitude grid */}
        {[80, 130, 180, 230].map((y) => (
          <line key={`h-${y}`} x1="20" y1={y} x2="320" y2={y} stroke="var(--color-accent)" strokeWidth="0.4" opacity="0.15" />
        ))}
        {[70, 130, 190, 250].map((x) => (
          <line key={`v-${x}`} x1={x} y1="30" x2={x} y2="260" stroke="var(--color-accent)" strokeWidth="0.4" opacity="0.15" />
        ))}

        {/* Cape Breton Island — detailed landmass contour */}
        <path
          d="M90,200 C70,175 65,145 80,120 C95,95 115,75 140,60 C165,45 195,42 215,50 C235,58 255,75 265,100 C275,125 270,160 260,185 C250,210 235,230 215,240 C195,250 165,252 140,240 C115,228 100,215 90,200 Z"
          fill="#EADCB9"
          stroke="#A9843D"
          strokeWidth="2"
          className={styles.island}
        />

        {/* Bras d'Or Lake (inland water body) */}
        <path
          d="M145,155 C140,140 155,125 175,130 C195,135 205,155 195,170 C185,185 160,185 150,175 C140,165 145,160 145,155 Z"
          fill="#1B3A4B"
          opacity="0.55"
          stroke="#A9843D"
          strokeWidth="0.8"
        />

        {/* Cabot Trail Highway — always visible as faint dashed loop */}
        <path
          d="M225,175 C200,160 175,130 155,105 C135,80 140,60 165,55 C190,50 210,55 205,65 C200,80 185,100 175,120 C165,140 170,158 195,170 C210,175 220,175 225,175"
          fill="none"
          stroke="#C1663E"
          strokeWidth="1.5"
          strokeDasharray="4,3"
          opacity="0.2"
        />

        {/* Route paths (drawn on hover/active) */}
        {Object.entries(routePaths).map(([slug, d]) => (
          <path
            key={slug}
            d={d}
            data-route={slug}
            fill="none"
            stroke={slug === "full-cabot-trail" ? "#C1663E" : "#A9843D"}
            strokeWidth={slug === "full-cabot-trail" ? "2.5" : "2"}
            strokeLinecap="round"
            className={styles.routePath}
            opacity="0.3"
          />
        ))}

        {/* Sydney Port — home base marker */}
        <g>
          <circle cx="225" cy="175" r="7" fill="#14201F" opacity="0.9" />
          <circle cx="225" cy="175" r="3" fill="#FAF7F0" />
          <circle cx="225" cy="175" r="10" fill="none" stroke="#14201F" strokeWidth="0.8" strokeDasharray="2,2">
            <animateTransform attributeName="transform" type="rotate" from="0 225 175" to="360 225 175" dur="12s" repeatCount="indefinite" />
          </circle>
          <text x="237" y="172" fontSize="7" fontFamily="monospace" fill="#14201F" fontWeight="bold">PORT</text>
        </g>

        {/* Tour pins */}
        {tourPins.map((pin) => (
          <g
            key={pin.slug}
            data-pin={pin.slug}
            className={styles.pin}
            onMouseEnter={() => { setHoveredSlug(pin.slug); onPinHover(pin.slug); }}
            onMouseLeave={() => { setHoveredSlug(null); onPinHover(null); }}
            onClick={() => onPinClick(pin.slug)}
            style={{ cursor: "pointer" }}
          >
            {/* Pin dot */}
            <circle cx={pin.x} cy={pin.y} r={pin.flagship ? 6 : 4.5} fill={pin.color} opacity="0.9" />
            <circle cx={pin.x} cy={pin.y} r={pin.flagship ? 2.5 : 1.5} fill="#FAF7F0" />
            
            {/* Label — appears on hover */}
            {currentSlug === pin.slug && (
              <g className={styles.pinLabel}>
                <rect
                  x={pin.x + 10}
                  y={pin.y - 10}
                  width={pin.label.length * 5.5 + 12}
                  height="18"
                  rx="2"
                  fill="rgba(20, 32, 31, 0.92)"
                />
                <text
                  x={pin.x + 16}
                  y={pin.y + 2}
                  fontSize="7.5"
                  fontFamily="monospace"
                  fill="#FAF7F0"
                  fontWeight="bold"
                >
                  {pin.label}
                </text>
              </g>
            )}
          </g>
        ))}

        {/* Compass rose */}
        <g transform="translate(55, 235) scale(0.55)">
          <circle cx="0" cy="0" r="18" fill="none" stroke="#A9843D" strokeWidth="0.8" />
          <polygon points="0,-20 2.5,-4 0,0 -2.5,-4" fill="#C1663E" />
          <polygon points="0,20 2.5,4 0,0 -2.5,4" fill="#EADCB9" stroke="#A9843D" strokeWidth="0.5" />
          <line x1="-20" y1="0" x2="20" y2="0" stroke="#A9843D" strokeWidth="0.6" />
          <text x="-3" y="-23" fontSize="8" fontFamily="serif" fontStyle="italic" fill="#14201F">N</text>
        </g>

        {/* Scale bar */}
        <line x1="250" y1="258" x2="310" y2="258" stroke="#A9843D" strokeWidth="1" />
        <line x1="250" y1="255" x2="250" y2="261" stroke="#A9843D" strokeWidth="0.8" />
        <line x1="310" y1="255" x2="310" y2="261" stroke="#A9843D" strokeWidth="0.8" />
        <text x="268" y="268" fontSize="6" fontFamily="monospace" fill="#A9843D">~50 km</text>

        {/* Map title cartouche */}
        <text x="170" y="22" textAnchor="middle" fontSize="10" fontFamily="serif" fontStyle="italic" fill="#14201F" opacity="0.6">Cape Breton Island</text>
      </svg>

      {/* Hover info strip below map */}
      <div className={styles.infoStrip}>
        {currentSlug ? (
          <>
            <span className={styles.infoRoute}>ROUTE ACTIVE</span>
            <span className={styles.infoName}>{tourPins.find(p => p.slug === currentSlug)?.label}</span>
            <span className={styles.infoAction}>Click pin to scroll ↓</span>
          </>
        ) : (
          <span className={styles.infoIdle}>Hover a pin to preview the route trace</span>
        )}
      </div>
    </div>
  );
}
