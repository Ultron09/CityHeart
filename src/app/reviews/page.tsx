import TrustStrip from "@/components/TrustStrip";
import DynamicReviewCard from "@/components/DynamicReviewCard";
import styles from "./reviews.module.css";

export default function ReviewsPage() {
  const reviewsData = [
    {
      name: "Sarah M.",
      date: "June 2026",
      stars: 5,
      title: "Best Shore Excursion of our Cruise!",
      text: "We booked Jessie for the Cabot Trail loop. What an incredible day! He knew all the best lookout spots and shared so many stories about Cape Breton. It was way better than the crowded ship bus tour.",
      tour: "Full Cabot Trail Tour"
    },
    {
      name: "David K.",
      date: "May 2026",
      stars: 5,
      title: "Fortress of Louisbourg was Amazing",
      text: "Our guide KV was super friendly and very knowledgeable. He explained the history of Sydney on the drive, and the fortress itself was fascinating. Very comfortable Durango SUV.",
      tour: "Louisbourg Fortress Tour"
    },
    {
      name: "Robert & Helen",
      date: "September 2025",
      stars: 5,
      title: "Perfect Mini Cabot Trial",
      text: "We only had 5 hours in port, so we took the Bell Museum & Mini Cabot trail package. Jessie made sure we got back to the dock with plenty of time to spare. A flawless trip!",
      tour: "Bell Museum & Mini Cabot"
    },
    {
      name: "Janet L.",
      date: "October 2025",
      stars: 5,
      title: "Spectacular fall colors",
      text: "We did the custom lakes & lighthouse drive. The colors of the foliage were stunning. Jessie is an absolute gentleman and a fantastic host.",
      tour: "Sydney Lakes & Lighthouse"
    },
    {
      name: "Teresa P.",
      date: "August 2025",
      stars: 5,
      title: "Intimate and local",
      text: "My family loved the Sydney Roots and Wildlife tour. Two Rivers Wildlife park was great for the kids and our driver was excellent. Highly recommend!",
      tour: "Sydney Roots & Wildlife"
    },
    {
      name: "Mark B.",
      date: "July 2025",
      stars: 4,
      title: "Very accommodating guides",
      text: "Great private tour of Iona Highland Village. Staggering views of Bras d'Or Lake. A bit cozy in the third row, but the guide's storytelling made up for it.",
      tour: "Iona Highland Village Tour"
    }
  ];

  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <h1 className={styles.title}>What Our Guests Say</h1>
        <p className={styles.subtitle}>
          Read verified reviews from travelers who experienced Cape Breton with us.
        </p>
      </header>

      {/* Stats Breakdown Summary */}
      <section className={styles.statSection}>
        <div className={styles.statSummary}>
          <div className={styles.score}>4.5</div>
          <div className={styles.stars}>★★★★★</div>
          <div className={styles.statBadge}>
            <strong>#2 of 26</strong> Sydney Tours on TripAdvisor
          </div>
          <div style={{ fontSize: "0.85rem", color: "var(--color-text-muted)", marginTop: "0.5rem" }}>
            Based on 54 traveler reviews
          </div>
        </div>

        {/* Fake visual bar chart breakdown */}
        <div className={styles.breakdownList}>
          <div className={styles.breakdownRow}>
            <span className={styles.label}>Excellent</span>
            <div className={styles.barWrapper}>
              <div className={styles.barFill} style={{ width: "85%" }} />
            </div>
            <span className={styles.count}>46</span>
          </div>
          <div className={styles.breakdownRow}>
            <span className={styles.label}>Very Good</span>
            <div className={styles.barWrapper}>
              <div className={styles.barFill} style={{ width: "11%" }} />
            </div>
            <span className={styles.count}>6</span>
          </div>
          <div className={styles.breakdownRow}>
            <span className={styles.label}>Average</span>
            <div className={styles.barWrapper}>
              <div className={styles.barFill} style={{ width: "4%" }} />
            </div>
            <span className={styles.count}>2</span>
          </div>
          <div className={styles.breakdownRow}>
            <span className={styles.label}>Poor</span>
            <div className={styles.barWrapper}>
              <div className={styles.barFill} style={{ width: "0%" }} />
            </div>
            <span className={styles.count}>0</span>
          </div>
          <div className={styles.breakdownRow}>
            <span className={styles.label}>Terrible</span>
            <div className={styles.barWrapper}>
              <div className={styles.barFill} style={{ width: "0%" }} />
            </div>
            <span className={styles.count}>0</span>
          </div>
        </div>
      </section>

      {/* Review Grid */}
      <section className={styles.grid}>
        {reviewsData.map((rev, index) => (
          <DynamicReviewCard key={index} {...rev} />
        ))}
      </section>

      <div style={{ marginTop: "4rem" }}>
        <TrustStrip />
      </div>
    </div>
  );
}
