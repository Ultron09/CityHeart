"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./DynamicReviewCard.module.css";

gsap.registerPlugin(ScrollTrigger);

interface ReviewProps {
  name: string;
  date: string;
  stars: number;
  title: string;
  text: string;
  tour: string;
}

export default function DynamicReviewCard({ name, date, stars, title, text, tour }: ReviewProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const starsContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const card = cardRef.current;
    const stars = starsContainerRef.current?.children;
    if (!card || !stars) return;

    const trigger = ScrollTrigger.create({
      trigger: card,
      start: "top 90%",
      onEnter: () => {
        // Paramount Pictures style flying-in stars animation
        gsap.fromTo(
          stars,
          {
            opacity: 0,
            scale: 5,
            rotation: 270,
            // Spatially stagger their starting positions offscreen (arch shape)
            x: (i) => -180 + i * 45,
            y: (i) => -150 - Math.sin((i / (stars.length - 1)) * Math.PI) * 80,
          },
          {
            opacity: 1,
            scale: 1,
            rotation: 0,
            x: 0,
            y: 0,
            stagger: 0.12,
            duration: 0.85,
            ease: "back.out(2)",
          }
        );

        // Slide up the editorial review text details in sequence
        gsap.fromTo(
          card.querySelectorAll(".review-fade"),
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, stagger: 0.1, duration: 0.7, ease: "power2.out" }
        );
      },
    });

    return () => trigger.kill();
  }, []);

  return (
    <div ref={cardRef} className={`${styles.reviewCard} brass-double-frame`}>
      <div className="brass-double-frame-inner" style={{ padding: "20px", display: "flex", flexDirection: "column", height: "100%" }}>
        
        {/* Header */}
        <div className={styles.cardHeader}>
          <div className="review-fade">
            <span className={styles.reviewerName}>{name}</span>
            <div className={styles.reviewDate}>{date}</div>
          </div>
          
          {/* Paramount style star containers */}
          <div ref={starsContainerRef} className={styles.starsContainer}>
            {Array.from({ length: stars }).map((_, i) => (
              <span key={i} className={styles.star}>★</span>
            ))}
          </div>
        </div>

        {/* Content details */}
        <h3 className={`${styles.reviewTitle} review-fade`}>{title}</h3>
        <p className={`${styles.reviewText} review-fade`}>&quot;{text}&quot;</p>
        
        {/* Tour route link ticket tag */}
        <div className={`${styles.tourTagWrapper} review-fade`}>
          <span className={styles.tourTag}>{tour}</span>
        </div>

      </div>
    </div>
  );
}
