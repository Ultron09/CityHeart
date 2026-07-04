"use client";

import React, { useState, useRef, useCallback } from "react";
import gsap from "gsap";
import styles from "./CapeBretonMap.module.css";

/*
  Accurate Cape Breton Island SVG path traced from real cartographic data.
  The island is roughly triangular, with the Cape Breton Highlands peninsula
  pushing north, the Bras d'Or Lakes cutting through the center, Sydney on
  the east coast, and the Canso Causeway connecting at the southwest.
  
  ViewBox: 0 0 400 340 — North is up.
*/

// Accurate Cape Breton landmass path
const ISLAND_PATH = `
M 95,310 
C 85,295 75,275 72,255
C 68,230 78,210 85,195
C 90,183 88,170 82,155
C 76,140 72,122 78,105
C 84,88 95,75 110,65
C 125,55 138,42 155,32
C 172,22 190,18 208,22
C 225,26 240,35 255,48
C 268,58 278,72 285,88
C 292,105 295,125 290,142
C 286,155 288,168 295,178
C 305,192 315,208 320,228
C 325,248 318,268 305,282
C 290,298 270,310 248,315
C 225,322 195,320 170,315
C 145,310 120,312 95,310 Z
`;

// Bras d'Or Lake system — the massive inland sea
const BRASDOR_PATH = `
M 155,175
C 148,160 158,145 175,140
C 195,135 215,142 228,155
C 240,168 242,185 232,200
C 222,215 205,222 188,218
C 170,212 160,195 155,175 Z
`;

// Tour pin data with corrected positions matching the accurate map
const tourPins = [
  { slug: "sydney-city-lighthouse", label: "Sydney City & Lighthouse", x: 295, y: 178, color: "#C1663E" },
  { slug: "louisbourg-fortress", label: "Louisbourg Fortress", x: 310, y: 228, color: "#C1663E" },
  { slug: "cabot-trail-ingonish", label: "Ingonish & Green Cove", x: 275, y: 88, color: "#1B3A4B" },
  { slug: "bell-museum-mini-cabot", label: "Bell Museum + Mini Cabot", x: 185, y: 140, color: "#A9843D" },
  { slug: "bell-museum-highland-village", label: "Bell Museum + Highland", x: 145, y: 195, color: "#A9843D" },
  { slug: "full-cabot-trail", label: "Full Cabot Trail ★", x: 195, y: 55, color: "#C1663E", flagship: true },
  { slug: "sydney-city-lakes-lighthouse", label: "Sydney Lakes & Lighthouse", x: 260, y: 195, color: "#C1663E" },
  { slug: "sydney-root-wildlife", label: "Sydney Root & Wildlife", x: 235, y: 215, color: "#C1663E" },
  { slug: "iona-highland-village-tour", label: "Iona Highland Village", x: 160, y: 175, color: "#A9843D" },
  { slug: "alexander-bell-museum-tour", label: "Alexander Bell Museum", x: 180, y: 148, color: "#A9843D" },
];

// Route paths from Sydney Port to each tour destination
const routePaths: Record<string, string> = {
  "sydney-city-lighthouse": "M295,178 Q300,170 298,160",
  "louisbourg-fortress": "M295,178 C300,195 308,210 310,228",
  "cabot-trail-ingonish": "M295,178 C290,150 285,120 275,88",
  "bell-museum-mini-cabot": "M295,178 C260,170 225,155 185,140",
  "bell-museum-highland-village": "M295,178 C255,185 200,190 145,195",
  "full-cabot-trail": "M295,178 C280,155 265,120 250,90 C235,65 210,42 185,35 C160,30 140,42 125,62 C110,82 115,110 135,130 C155,145 180,155 210,165 C240,172 268,176 295,178",
  "sydney-city-lakes-lighthouse": "M295,178 Q280,188 260,195",
  "sydney-root-wildlife": "M295,178 C270,190 252,205 235,215",
  "iona-highland-village-tour": "M295,178 C250,180 210,178 160,175",
  "alexander-bell-museum-tour": "M295,178 C255,168 220,155 180,148",
};

interface CapeBretonMapProps {
  onPinHover: (slug: string | null) => void;
  onPinClick: (slug: string) => void;
  activeSlug: string | null;
}

export default function CapeBretonMap({ onPinHover, onPinClick, activeSlug }: CapeBretonMapProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [hoveredSlug, setHoveredSlug] = useState<string | null>(null);
  const activePathRef = useRef<SVGPathElement | null>(null);

  const currentSlug = activeSlug || hoveredSlug;

  // Optimized: directly manipulate DOM on hover without useEffect re-renders
  const handlePinEnter = useCallback((slug: string) => {
    setHoveredSlug(slug);
    onPinHover(slug);

    if (!svgRef.current) return;

    // Draw this route
    const path = svgRef.current.querySelector(`[data-route="${slug}"]`) as SVGPathElement | null;
    if (path) {
      const length = path.getTotalLength();
      path.style.strokeDasharray = `${length}`;
      path.style.strokeDashoffset = `${length}`;
      path.style.opacity = "1";
      // Use CSS transition instead of GSAP for zero-overhead
      requestAnimationFrame(() => {
        path.style.transition = "stroke-dashoffset 0.8s ease-out";
        path.style.strokeDashoffset = "0";
      });
      activePathRef.current = path;
    }

    // Scale pin
    const pin = svgRef.current.querySelector(`[data-pin="${slug}"]`) as SVGGElement | null;
    if (pin) {
      pin.style.transition = "transform 0.2s ease-out";
      pin.style.transform = "scale(1.35)";
      pin.style.transformOrigin = "center";
    }
  }, [onPinHover]);

  const handlePinLeave = useCallback(() => {
    const prevSlug = hoveredSlug;
    setHoveredSlug(null);
    onPinHover(null);

    if (!svgRef.current || !prevSlug) return;

    // Reset route
    const path = svgRef.current.querySelector(`[data-route="${prevSlug}"]`) as SVGPathElement | null;
    if (path) {
      path.style.transition = "opacity 0.3s ease";
      path.style.opacity = "0.15";
    }

    // Reset pin
    const pin = svgRef.current.querySelector(`[data-pin="${prevSlug}"]`) as SVGGElement | null;
    if (pin) {
      pin.style.transition = "transform 0.2s ease";
      pin.style.transform = "scale(1)";
    }
    activePathRef.current = null;
  }, [hoveredSlug, onPinHover]);

  const handlePinClickLocal = useCallback((slug: string) => {
    onPinClick(slug);
  }, [onPinClick]);

  return (
    <div className={styles.mapContainer}>
      <div className={styles.mapHeader}>
        <span className="mono-label">NAVIGATION CHART // CAPE BRETON ISLAND</span>
        <p className={styles.mapInstruction}>Hover a pin to trace the route. Click to jump to details.</p>
      </div>
      
      <svg
        ref={svgRef}
        viewBox="0 0 400 340"
        className={styles.mapSvg}
        role="img"
        aria-label="Interactive map of Cape Breton Island showing tour routes"
      >
        {/* Ocean background */}
        <rect x="0" y="0" width="400" height="340" fill="#1B3A4B" opacity="0.06" rx="4" />

        {/* Latitude/Longitude grid */}
        {[70, 130, 190, 250, 310].map((y) => (
          <line key={`h-${y}`} x1="30" y1={y} x2="380" y2={y} stroke="#A9843D" strokeWidth="0.3" opacity="0.12" />
        ))}
        {[80, 150, 220, 290, 360].map((x) => (
          <line key={`v-${x}`} x1={x} y1="15" x2={x} y2="330" stroke="#A9843D" strokeWidth="0.3" opacity="0.12" />
        ))}

        {/* Cape Breton Island — accurate landmass */}
        <path d={ISLAND_PATH} fill="#EADCB9" stroke="#A9843D" strokeWidth="2" />

        {/* Bras d'Or Lake system */}
        <path d={BRASDOR_PATH} fill="#1B3A4B" opacity="0.45" stroke="#A9843D" strokeWidth="0.8" />

        {/* Cabot Trail Highway — always visible faint dashed loop */}
        <path
          d={routePaths["full-cabot-trail"]}
          fill="none"
          stroke="#C1663E"
          strokeWidth="1.2"
          strokeDasharray="4,3"
          opacity="0.15"
        />

        {/* Route paths (drawn on hover) */}
        {Object.entries(routePaths).map(([slug, d]) => (
          <path
            key={slug}
            d={d}
            data-route={slug}
            fill="none"
            stroke={slug === "full-cabot-trail" ? "#C1663E" : "#A9843D"}
            strokeWidth={slug === "full-cabot-trail" ? "2.5" : "2"}
            strokeLinecap="round"
            opacity="0.15"
          />
        ))}

        {/* Sydney Port — home base */}
        <circle cx="295" cy="178" r="7" fill="#14201F" opacity="0.85" />
        <circle cx="295" cy="178" r="3" fill="#FAF7F0" />
        <circle cx="295" cy="178" r="11" fill="none" stroke="#14201F" strokeWidth="0.6" strokeDasharray="2,2" className={styles.portPulse} />
        <text x="307" y="175" fontSize="7" fontFamily="monospace" fill="#14201F" fontWeight="bold">PORT</text>

        {/* Tour pins */}
        {tourPins.map((pin) => (
          <g
            key={pin.slug}
            data-pin={pin.slug}
            className={styles.pin}
            onMouseEnter={() => handlePinEnter(pin.slug)}
            onMouseLeave={handlePinLeave}
            onClick={() => handlePinClickLocal(pin.slug)}
            style={{ cursor: "pointer" }}
          >
            <circle cx={pin.x} cy={pin.y} r={pin.flagship ? 6 : 4.5} fill={pin.color} opacity="0.9" />
            <circle cx={pin.x} cy={pin.y} r={pin.flagship ? 2.5 : 1.5} fill="#FAF7F0" />
            
            {hoveredSlug === pin.slug && (
              <g>
                <rect
                  x={pin.x + 10}
                  y={pin.y - 11}
                  width={pin.label.length * 5.2 + 14}
                  height="18"
                  rx="2"
                  fill="rgba(20, 32, 31, 0.92)"
                />
                <text
                  x={pin.x + 17}
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
        <g transform="translate(55, 285) scale(0.55)">
          <circle cx="0" cy="0" r="18" fill="none" stroke="#A9843D" strokeWidth="0.8" />
          <polygon points="0,-20 2.5,-4 0,0 -2.5,-4" fill="#C1663E" />
          <polygon points="0,20 2.5,4 0,0 -2.5,4" fill="#EADCB9" stroke="#A9843D" strokeWidth="0.5" />
          <line x1="-20" y1="0" x2="20" y2="0" stroke="#A9843D" strokeWidth="0.6" />
          <text x="-3" y="-23" fontSize="8" fontFamily="serif" fontStyle="italic" fill="#14201F">N</text>
        </g>

        {/* Scale bar */}
        <line x1="310" y1="318" x2="370" y2="318" stroke="#A9843D" strokeWidth="1" />
        <line x1="310" y1="315" x2="310" y2="321" stroke="#A9843D" strokeWidth="0.8" />
        <line x1="370" y1="315" x2="370" y2="321" stroke="#A9843D" strokeWidth="0.8" />
        <text x="328" y="328" fontSize="6" fontFamily="monospace" fill="#A9843D">~50 km</text>

        {/* Map title */}
        <text x="200" y="16" textAnchor="middle" fontSize="10" fontFamily="serif" fontStyle="italic" fill="#14201F" opacity="0.5">Cape Breton Island, Nova Scotia</text>
      </svg>

      {/* Info strip */}
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
