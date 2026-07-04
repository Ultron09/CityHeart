"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import gsap from "gsap";
import styles from "./page.module.css";
import PaperGlobe from "@/components/PaperGlobe";
import JourneyParallax from "@/components/JourneyParallax";
import TourCard from "@/components/TourCard";
import TrustStrip from "@/components/TrustStrip";
import { getTourBySlug } from "@/data/tours";

export default function Home() {
  const flagshipTour = getTourBySlug("full-cabot-trail");
  const heroRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const globeWrapperRef = useRef<HTMLDivElement>(null);
  const lensRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero entrance animations
      gsap.to(".animate-text", {
        y: 0,
        opacity: 1,
        duration: 1.2,
        stagger: 0.15,
        ease: "power3.out",
      });
      
      gsap.to(".animate-card", {
        y: 0,
        opacity: 1,
        duration: 1.2,
        stagger: 0.1,
        ease: "power3.out",
        delay: 0.4
      });
    }, heroRef);

    // Interactive magnifying lens optical coordinates parallax
    const wrapper = globeWrapperRef.current;
    const lens = lensRef.current;
    const mapEl = mapRef.current;

    if (wrapper && lens && mapEl) {
      const xTo = gsap.quickTo(lens, "x", { duration: 0.25, ease: "power2.out" });
      const yTo = gsap.quickTo(lens, "y", { duration: 0.25, ease: "power2.out" });
      const mapXTo = gsap.quickTo(mapEl, "x", { duration: 0.25, ease: "power2.out" });
      const mapYTo = gsap.quickTo(mapEl, "y", { duration: 0.25, ease: "power2.out" });

      const onMouseMove = (e: MouseEvent) => {
        const rect = wrapper.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        // Position lens centered on mouse
        xTo(mouseX - 90);
        yTo(mouseY - 90);

        // Move map opposite direction to create real magnifying parallax effect
        // Scale factor: 300px local map vs 350px container
        const offsetX = -(mouseX / rect.width) * 140 + 20;
        const offsetY = -(mouseY / rect.height) * 140 + 20;
        mapXTo(offsetX);
        mapYTo(offsetY);
      };

      const onMouseEnter = () => {
        gsap.to(lens, { opacity: 1, scale: 1, duration: 0.35, ease: "back.out(1.7)" });
      };

      const onMouseLeave = () => {
        gsap.to(lens, { opacity: 0, scale: 0.8, duration: 0.3, ease: "power2.in" });
      };

      wrapper.addEventListener("mousemove", onMouseMove);
      wrapper.addEventListener("mouseenter", onMouseEnter);
      wrapper.addEventListener("mouseleave", onMouseLeave);

      return () => {
        wrapper.removeEventListener("mousemove", onMouseMove);
        wrapper.removeEventListener("mouseenter", onMouseEnter);
        wrapper.removeEventListener("mouseleave", onMouseLeave);
        ctx.revert();
      };
    }

    return () => ctx.revert();
  }, []);

  const destinations = [
    {
      name: "Cabot Trail",
      region: "46.64° N, 60.40° W",
      image: "/images/tours/full-cabot-trail/hero.jpg",
    },
    {
      name: "Fortress of Louisbourg",
      region: "45.92° N, 59.97° W",
      image: "/images/tours/louisbourg-fortress/hero.jpg",
    },
    {
      name: "Ingonish & Green Cove",
      region: "46.63° N, 60.39° W",
      image: "/images/tours/cabot-trail-ingonish/hero.jpg",
    },
    {
      name: "Alexander Graham Bell Museum",
      region: "46.09° N, 60.75° W",
      image: "/images/tours/alexander-bell-museum-tour/hero.jpg",
    },
  ];

  return (
    <div ref={heroRef} className={styles.page}>
      {/* 1. Asymmetric Hero */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <div className={`${styles.heroCoord} animate-text`}>SYDNEY PORT BASE // 46.13° N, 60.19° W</div>
          <h1 className={`${styles.heroTitle} animate-text`}>
            Trace a route across Cape Breton.
          </h1>
          {/* Drop Cap styling on first letter */}
          <div className={`${styles.heroDescWrapper} animate-text`}>
            <p className={`${styles.heroDesc} drop-cap`}>
              I am Jaswinder Singh. I design private, small-group excursions 
              across the cliffs, Gaelic paths, and historic shorelines of Nova Scotia. 
              Come as a guest, leave as a friend.
            </p>
            {/* Elegant calligraphic handwriting signature */}
            <div className={styles.signatureContainer}>
              <svg className={styles.signatureSvg} viewBox="0 0 160 50">
                <path
                  d="M 12 30 C 22 8, 38 12, 40 38 Q 48 10, 56 12 Q 62 25, 68 12 Q 74 25, 80 12 C 86 28, 92 12, 98 12 C 104 28, 110 8, 116 12 C 122 35, 132 15, 142 36"
                  fill="none"
                  stroke="var(--color-accent)"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className={styles.signaturePath}
                />
              </svg>
            </div>
          </div>
          <Link href="/tours" className={`${styles.heroCTA} animate-text`}>
            Explore the Routes
          </Link>
        </div>
        <div ref={globeWrapperRef} className={styles.globeWrapper}>
          <PaperGlobe />
          
          {/* Vintage optical magnifier glass lens */}
          <div ref={lensRef} className={styles.magnifierLens}>
            <div ref={mapRef} className={styles.magnifierMap}>
              {/* Detailed vector map of Cape Breton */}
              <svg viewBox="0 0 320 320" className={styles.localMapSvg}>
                {/* Land Mass Contour */}
                <path
                  d="M60,180 C40,140 75,80 130,60 C185,40 240,70 270,110 C300,150 285,215 240,250 C195,290 130,295 90,255 C50,215 80,205 60,180 Z"
                  fill="#EADCB9"
                  stroke="#A9843D"
                  strokeWidth="2.2"
                />
                
                {/* Inland Bras d'Or Lake */}
                <path
                  d="M130,165 C120,145 155,125 175,135 C195,145 205,175 185,195 C165,215 140,185 130,165 Z"
                  fill="#1B3A4B"
                  opacity="0.75"
                  stroke="#A9843D"
                  strokeWidth="1.2"
                />

                {/* Cabot Trail Golden Highway Loop */}
                <path
                  d="M100,95 C120,65 175,60 215,75 C245,90 235,135 205,145 C175,155 145,125 100,95 Z"
                  fill="none"
                  stroke="#C1663E"
                  strokeWidth="3.2"
                  strokeDasharray="6,4"
                />

                {/* Sydney Port Pin */}
                <circle cx="225" cy="155" r="5" fill="#A9843D" />
                <circle cx="225" cy="155" r="1.5" fill="#FAF7F0" />
                <text x="235" y="159" className={styles.mapLabel} fontSize="9">Sydney (Port)</text>

                {/* Louisbourg Fortress Pin */}
                <polygon points="260,205 264,197 268,205 262,209" fill="#C1663E" />
                <text x="182" y="209" className={styles.mapLabel} fontSize="9">Fortress Louisbourg</text>

                {/* Ingonish Cliffs Pin */}
                <path d="M200,70 L206,65 L204,75 Z" fill="#C1663E" />
                <text x="210" y="68" className={styles.mapLabel} fontSize="9">Ingonish Cliffs</text>

                {/* Compass Rose in Atlantic Ocean */}
                <g transform="translate(90, 225) scale(0.65)">
                  <circle cx="0" cy="0" r="18" fill="none" stroke="#A9843D" strokeWidth="0.8" />
                  <line x1="-22" y1="0" x2="22" y2="0" stroke="#A9843D" strokeWidth="0.8" />
                  <line x1="0" y1="-22" x2="0" y2="22" stroke="#A9843D" strokeWidth="0.8" />
                  <polygon points="0,-22 2.5,-4 0,0 -2.5,-4" fill="#C1663E" />
                  <polygon points="0,22 2.5,4 0,0 -2.5,4" fill="#FAF7F0" stroke="#A9843D" strokeWidth="0.8" />
                  <text x="-4" y="-24" fontSize="10" fontFamily="serif" fontStyle="italic" fill="#14201F">N</text>
                </g>

                {/* Grid Coordinates markings */}
                <path d="M 60 50 L 60 300" stroke="rgba(169, 132, 61, 0.15)" strokeWidth="0.8" />
                <path d="M 180 50 L 180 300" stroke="rgba(169, 132, 61, 0.15)" strokeWidth="0.8" />
                <path d="M 50 140 L 280 140" stroke="rgba(169, 132, 61, 0.15)" strokeWidth="0.8" />
              </svg>
            </div>
            
            {/* Specular glass reflection & frame border */}
            <div className={styles.lensGlass} />
            <span className={styles.lensLabel}>CAPE BRETON DETAIL</span>
          </div>
        </div>
      </section>

      <hr className="brass-hairline" />

      {/* 2. Featured Flagship Tour (Double framed) */}
      <section className={styles.featured}>
        <div className={styles.featuredHeader}>
          <h2 className={styles.featuredTitle}>The Flagship Journey</h2>
          <p className={styles.featuredDesc}>
            Our comprehensive 8-to-10 hour loop through the world-famous Cabot Trail. 
            Climb the winding mountain paths, stop at localized lookouts, and enjoy 
            fresh Atlantic seafood at the ocean&apos;s edge.
          </p>
        </div>
        <div className={styles.featuredWrapper}>
          <div className="brass-double-frame" style={{ width: "100%" }}>
            <div className="brass-double-frame-inner" style={{ padding: "8px", backgroundColor: "var(--color-bg-white)" }}>
              {flagshipTour && <TourCard tour={flagshipTour} variant="flagship" />}
            </div>
          </div>
        </div>
      </section>

      <hr className="brass-hairline" />

      {/* 3. The Journey - Scroll Parallax */}
      <JourneyParallax />

      <hr className="brass-hairline" />

      {/* 4. Destinations Horizontal card rail */}
      <section className={styles.destinationsSection}>
        <div className={styles.destinationsHeader}>
          <h2 className={styles.destinationsTitle}>Signature Stops</h2>
        </div>
        <div ref={cardsRef} className={styles.cardRail}>
          {destinations.map((dest, i) => (
            <div key={i} className={`${styles.destCard} animate-card`}>
              <div className="brass-double-frame-inner" style={{ padding: "4px", height: "100%", display: "flex", flexDirection: "column" }}>
                <div className={styles.destImageWrapper}>
                  <Image
                    src={dest.image}
                    alt={`${dest.name} landscape`}
                    fill
                    sizes="280px"
                    style={{ objectFit: "cover" }}
                  />
                </div>
                <h3 className={styles.destName}>{dest.name}</h3>
                <span className={styles.destRegion}>{dest.region}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <hr className="brass-hairline" />

      {/* 5. Testimonials (Boarding-pass stubs) */}
      <section className={styles.testimonials}>
        <div className={styles.testimonialsHeader}>
          <h2 className={styles.testimonialsTitle}>Traveler Journals</h2>
          <p className={styles.testimonialsDesc}>
            Real reflections from passengers who booked their Cape Breton journey with us.
          </p>
        </div>
        
        <div className={styles.ticketGrid}>
          {/* Passenger stub 1 */}
          <div className={styles.boardingPass}>
            <div className="brass-double-frame-inner" style={{ padding: "16px", display: "flex", flexDirection: "column", height: "100%", justifyContent: "space-between" }}>
              <div className={styles.passHeader}>
                <span className={styles.passCode}>PASSENGER STUB // CABOT</span>
                <span className={styles.passFlight}>FLIGHT CHT-082</span>
              </div>
              <p className={styles.passQuote}>
                &quot;We booked Jessie for the Cabot Trail loop. What an incredible day! 
                He knew all the best lookout spots and shared so many stories about Cape Breton. 
                It was way better than the crowded ship bus tour.&quot;
              </p>
              <div className={styles.passFooter}>
                <span>SARAH M. // BOSTON</span>
                <span>GATE DOCK-1 // SYDNEY PORT</span>
              </div>
            </div>
          </div>

          {/* Passenger stub 2 */}
          <div className={styles.boardingPass}>
            <div className="brass-double-frame-inner" style={{ padding: "16px", display: "flex", flexDirection: "column", height: "100%", justifyContent: "space-between" }}>
              <div className={styles.passHeader}>
                <span className={styles.passCode}>PASSENGER STUB // LBG</span>
                <span className={styles.passFlight}>FLIGHT CHT-104</span>
              </div>
              <p className={styles.passQuote}>
                &quot;KV was super friendly and very knowledgeable. He explained the history 
                of Sydney on the drive, and the Fortress of Louisbourg was absolutely fascinating. 
                Very comfortable SUV.&quot;
              </p>
              <div className={styles.passFooter}>
                <span>DAVID K. // TORONTO</span>
                <span>GATE DOCK-1 // SYDNEY PORT</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Booking CTA */}
      <section className={styles.ctaSection}>
        <h2 className={styles.ctaTitle}>Trace your own route.</h2>
        <p className={styles.ctaDesc}>
          Our private tours accommodate up to 6 guests. Spaces are limited, 
          especially during the autumn foliage peak.
        </p>
        <Link href="/contact" className={styles.ctaBtn}>
          Reserve your seat
        </Link>
      </section>

      <TrustStrip />
    </div>
  );
}
