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

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".animate-text", {
        y: 40,
        opacity: 0,
        duration: 1.2,
        stagger: 0.15,
        ease: "power3.out",
      });
      
      gsap.from(".animate-card", {
        y: 60,
        opacity: 0,
        duration: 1.2,
        stagger: 0.1,
        ease: "power3.out",
        delay: 0.4
      });
    }, heroRef);

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
      {/* Side-margin coordinate stamps */}
      <div className={styles.leftMarginStamp}>SYDNEY // 46.13° N</div>
      <div className={styles.rightMarginStamp}>CABOT TRAIL // 60.40° W</div>

      {/* 1. Asymmetric Hero */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <div className={`${styles.heroCoord} animate-text`}>SYDNEY PORT BASE // 46.13° N, 60.19° W</div>
          <h1 className={`${styles.heroTitle} animate-text`}>
            Trace a route across Cape Breton.
          </h1>
          {/* Drop Cap styling on first letter */}
          <p className={`${styles.heroDesc} drop-cap animate-text`}>
            I am Jaswinder Singh. I design private, small-group excursions 
            across the cliffs, Gaelic paths, and historic shorelines of Nova Scotia. 
            Come as a guest, leave as a friend.
          </p>
          <Link href="/tours" className={`${styles.heroCTA} animate-text`}>
            Explore the Routes
          </Link>
        </div>
        <div className={styles.globeWrapper}>
          <PaperGlobe />
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
