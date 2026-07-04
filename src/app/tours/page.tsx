"use client";

import React, { useState, useTransition, useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { tours } from "@/data/tours";
import TourCard from "@/components/TourCard";
import styles from "./tours.module.css";

gsap.registerPlugin(ScrollTrigger);

export default function ToursPage() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [, startTransition] = useTransition();
  const headerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const compassRef = useRef<SVGGElement>(null);
  const ledgerRef = useRef<HTMLDivElement>(null);
  const countRef = useRef<HTMLSpanElement>(null);

  const handleFilterChange = (filter: string) => {
    startTransition(() => {
      setActiveFilter(filter);
    });
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    startTransition(() => {
      setSearchQuery(e.target.value);
    });
  };

  // Filter & Search Logic
  const filteredTours = tours.filter((tour) => {
    const matchesSearch = tour.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tour.shortDescription.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (!matchesSearch) return false;
    if (activeFilter === "all") return true;
    if (activeFilter === "flagship") return tour.isFlagship;
    if (activeFilter === "quick") return tour.category === "quick-taste";
    if (activeFilter === "half-full") return tour.category === "half-to-full-day";
    if (activeFilter === "custom") return tour.category === "private-custom";
    return true;
  });

  // GSAP entrance animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Header elements stagger in
      gsap.from(headerRef.current, {
        y: 40,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
      });

      // Compass needle spins on load
      if (compassRef.current) {
        gsap.fromTo(compassRef.current, {
          rotation: -720,
          transformOrigin: "50% 50%",
        }, {
          rotation: 0,
          duration: 2,
          ease: "elastic.out(1, 0.45)",
          delay: 0.4,
        });
      }

      // Filter ledger slides up
      if (ledgerRef.current) {
        gsap.from(ledgerRef.current, {
          y: 30,
          opacity: 0,
          duration: 0.8,
          ease: "power2.out",
          delay: 0.3,
        });
      }
    });

    return () => ctx.revert();
  }, []);

  // Animate cards on filter change / scroll
  useEffect(() => {
    if (!gridRef.current) return;

    const cards = gridRef.current.querySelectorAll(`.${styles.cardWrapper}`);
    if (cards.length === 0) return;

    // Reset and animate cards stagger
    gsap.fromTo(cards, {
      y: 60,
      opacity: 0,
      scale: 0.95,
      rotateX: 8,
    }, {
      y: 0,
      opacity: 1,
      scale: 1,
      rotateX: 0,
      duration: 0.7,
      stagger: 0.1,
      ease: "power3.out",
      clearProps: "all",
    });

    // Animate the results counter
    if (countRef.current) {
      gsap.fromTo(countRef.current, {
        scale: 1.4,
        color: "var(--color-accent)",
      }, {
        scale: 1,
        color: "var(--color-text-secondary)",
        duration: 0.5,
        ease: "back.out(2)",
      });
    }
  }, [activeFilter, searchQuery]);

  const categories = [
    { id: "all", name: "Show All Routes", icon: "🗺" },
    { id: "flagship", name: "Flagship Loop", icon: "⭐" },
    { id: "quick", name: "Quick Taste (1-4h)", icon: "⚡" },
    { id: "half-full", name: "Half-Full Day", icon: "🌄" },
    { id: "custom", name: "Private & Custom", icon: "🔒" }
  ];

  return (
    <div className={styles.container}>
      <header ref={headerRef} className={styles.header}>
        {/* Animated Compass Rose */}
        <div className={styles.compassContainer}>
          <svg viewBox="0 0 80 80" className={styles.compassSvg}>
            <circle cx="40" cy="40" r="36" fill="none" stroke="var(--color-accent)" strokeWidth="1.5" opacity="0.4" />
            <circle cx="40" cy="40" r="30" fill="none" stroke="var(--color-accent)" strokeWidth="0.8" opacity="0.25" />
            {/* Tick marks */}
            {Array.from({ length: 32 }).map((_, i) => {
              const angle = (i * 360) / 32;
              const isMajor = i % 8 === 0;
              const r1 = isMajor ? 28 : 32;
              const r2 = 36;
              const rad = (angle * Math.PI) / 180;
              return (
                <line
                  key={i}
                  x1={40 + r1 * Math.cos(rad)}
                  y1={40 + r1 * Math.sin(rad)}
                  x2={40 + r2 * Math.cos(rad)}
                  y2={40 + r2 * Math.sin(rad)}
                  stroke="var(--color-accent)"
                  strokeWidth={isMajor ? "1.5" : "0.6"}
                  opacity={isMajor ? "0.8" : "0.3"}
                />
              );
            })}
            {/* Spinning Needle */}
            <g ref={compassRef}>
              <polygon points="40,12 43,38 40,42 37,38" fill="var(--color-primary)" opacity="0.9" />
              <polygon points="40,68 43,42 40,38 37,42" fill="var(--color-border)" opacity="0.5" />
              <circle cx="40" cy="40" r="3" fill="var(--color-accent)" />
            </g>
            {/* Cardinal Labels */}
            <text x="40" y="10" textAnchor="middle" fontSize="7" fontFamily="serif" fontStyle="italic" fill="var(--color-text)">N</text>
            <text x="40" y="76" textAnchor="middle" fontSize="7" fontFamily="serif" fontStyle="italic" fill="var(--color-text-muted)">S</text>
            <text x="74" y="43" textAnchor="middle" fontSize="7" fontFamily="serif" fontStyle="italic" fill="var(--color-text-muted)">E</text>
            <text x="6" y="43" textAnchor="middle" fontSize="7" fontFamily="serif" fontStyle="italic" fill="var(--color-text-muted)">W</text>
          </svg>
        </div>

        <span className="mono-label">LOGBOOK REGISTER // CAPE BRETON EXCURSIONS</span>
        <h1 className={styles.title}>Trace Your Journey</h1>
        <p className={styles.subtitle}>
          Choose a routing option below or filter our ship&apos;s log of private tours.
        </p>
      </header>

      {/* Ship's Log Filter Ledger */}
      <div ref={ledgerRef} className={styles.ledger}>
        <div className="brass-double-frame" style={{ width: "100%" }}>
          <div className="brass-double-frame-inner" style={{ padding: "16px", backgroundColor: "var(--color-bg-white)", display: "flex", flexWrap: "wrap", gap: "12px", alignItems: "center", justifyContent: "space-between" }}>
            
            {/* Filter buttons with icons */}
            <div className={styles.filterGroup}>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => handleFilterChange(cat.id)}
                  className={`${styles.filterBtn} ${activeFilter === cat.id ? styles.activeFilter : ""}`}
                >
                  <span className={styles.filterIcon}>{cat.icon}</span>
                  {cat.name}
                </button>
              ))}
            </div>

            {/* Search input field styled like journal entry */}
            <div className={styles.searchBox}>
              <span className={styles.searchIcon}>📍</span>
              <input
                type="text"
                placeholder="Search coordinates or keywords..."
                value={searchQuery}
                onChange={handleSearchChange}
                className={styles.searchInput}
              />
            </div>

          </div>
        </div>
      </div>

      {/* Results count indicator */}
      <div className={styles.resultsBar}>
        <span ref={countRef} className={styles.resultsCount}>{filteredTours.length}</span>
        <span className={styles.resultsLabel}>routes found in ship log</span>
        <div className={styles.resultsDivider} />
      </div>

      {/* Dynamic Filter Results Grid */}
      <section className={styles.resultsSection}>
        {filteredTours.length > 0 ? (
          <div ref={gridRef} className={styles.grid}>
            {filteredTours.map((tour, index) => (
              <div key={tour.id} className={styles.cardWrapper} style={{ perspective: "800px" }}>
                <span className={styles.coordStamp}>
                  <span className={styles.indexBadge}>{String(index + 1).padStart(2, "0")}</span>
                  {tour.category === "quick-taste" && "LAT 46.13° N // SHORT PORT"}
                  {tour.category === "half-to-full-day" && "LAT 46.09° N // HISTORIC"}
                  {tour.category === "full-day" && "LAT 46.64° N // FLAGSHIP LOOP"}
                  {tour.category === "private-custom" && "LAT 45.92° N // PRIVATE"}
                </span>
                <TourCard tour={tour} variant={tour.isFlagship ? "flagship" : "standard"} />
              </div>
            ))}
          </div>
        ) : (
          <div className={styles.noResults}>
            <span className={styles.noResultsIcon}>⚓</span>
            <h3>No matching routes found in ship log.</h3>
            <p>Try searching for general keywords like &quot;Fortress&quot;, &quot;Cabot&quot;, or &quot;Lighthouse&quot;.</p>
          </div>
        )}
      </section>
    </div>
  );
}
