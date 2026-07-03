import Link from "next/link";
import styles from "./page.module.css";
import TourCard from "@/components/TourCard";
import ReviewTicker from "@/components/ReviewTicker";
import TrustStrip from "@/components/TrustStrip";
import { getTourBySlug } from "@/data/tours";

export default function Home() {
  const flagshipTour = getTourBySlug("full-cabot-trail");

  return (
    <div className={styles.page}>
      {/* 1. Hero */}
      <section className={styles.hero}>
        <div className={styles.heroOverlay}>
          <h1 className={styles.heroTitle}>Cape Breton, told by someone who calls it home.</h1>
          <p className={styles.heroSubtitle}>I am Jaswinder Singh. Come as a guest, leave as a friend.</p>
          <Link href="/tours" className={styles.heroCTA}>
            Explore Tours
          </Link>
        </div>
      </section>

      {/* 2. Immediate Trust Bar */}
      <section className={styles.trustBar}>
        <div className={styles.trustBadge}>
          <strong>TripAdvisor 4.5★</strong> (54 reviews)
        </div>
        <div className={styles.trustBadge}>
          <strong>#2 of 26</strong> Sydney tours
        </div>
        <div className={styles.trustBadge}>
          Local guide team
        </div>
      </section>

      {/* 3. Intent-based Tour Selector */}
      <section className={styles.intentSelector}>
        <h2>How much time do you have?</h2>
        <div className={styles.intentGrid}>
          <Link href="/tours#quick" className={styles.intentCard}>1-2 Hours</Link>
          <Link href="/tours#half" className={styles.intentCard}>Half Day (4-5 hrs)</Link>
          <Link href="/tours#full" className={styles.intentCard}>Full Day (5-10 hrs)</Link>
          <Link href="/tours#private" className={styles.intentCard}>Private & Custom</Link>
        </div>
      </section>

      {/* 4. Featured Flagship Tour */}
      <section className={styles.featuredTour}>
        <h2>Our Flagship Experience</h2>
        <div className={styles.featuredWrapper}>
           {flagshipTour && <TourCard tour={flagshipTour} variant="flagship" />}
        </div>
      </section>

      {/* 5. Live Review Ticker */}
      <section className={styles.reviewsSection}>
        <ReviewTicker />
      </section>

      {/* 6. Good to know Trust Strip */}
      <TrustStrip />
    </div>
  );
}
