"use client";

import React, { useState, useTransition } from "react";
import { tours } from "@/data/tours";
import TourCard from "@/components/TourCard";
import styles from "./tours.module.css";

export default function ToursPage() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [, startTransition] = useTransition();

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

  const categories = [
    { id: "all", name: "Show All Routes" },
    { id: "flagship", name: "Flagship Loop" },
    { id: "quick", name: "Quick Taste (1-4h)" },
    { id: "half-full", name: "Half-Full Day" },
    { id: "custom", name: "Private & Custom" }
  ];

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <span className="mono-label">LOGBOOK REGISTER // CAPE BRETON EXCURSIONS</span>
        <h1 className={styles.title}>Trace Your Journey</h1>
        <p className={styles.subtitle}>
          Choose a routing option below or filter our ship&apos;s log of private tours.
        </p>
      </header>

      {/* Ship's Log Filter Ledger */}
      <div className={styles.ledger}>
        <div className="brass-double-frame" style={{ width: "100%" }}>
          <div className="brass-double-frame-inner" style={{ padding: "16px", backgroundColor: "var(--color-bg-white)", display: "flex", flexWrap: "wrap", gap: "12px", alignItems: "center", justifyContent: "space-between" }}>
            
            {/* Filter buttons */}
            <div className={styles.filterGroup}>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => handleFilterChange(cat.id)}
                  className={`${styles.filterBtn} ${activeFilter === cat.id ? styles.activeFilter : ""}`}
                >
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

      {/* Dynamic Filter Results Grid */}
      <section className={styles.resultsSection}>
        {filteredTours.length > 0 ? (
          <div className={styles.grid}>
            {filteredTours.map((tour) => (
              <div key={tour.id} className={styles.cardWrapper}>
                <span className={styles.coordStamp}>
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
