import Link from "next/link";
import TrustStrip from "@/components/TrustStrip";
import CruiseWaterTank from "@/components/CruiseWaterTank";
import styles from "./cruise.module.css";

export default function CruisePassengersPage() {
  return (
    <div className={styles.container}>
      {/* Hero */}
      <section className={styles.hero}>
        <h1>Cruise Shore Excursions from Sydney Port</h1>
        <p>
          Skip the massive tour bus crowds and book a private, local-led tour 
          synchronized perfectly with your ship&apos;s port schedule.
        </p>
        <div className={styles.guaranteeBox}>
          <span className={styles.guaranteeBadge}>Guarantee</span>
          <span>100% Worry-Free Back-to-Ship Promise</span>
        </div>
      </section>

      {/* Port Meeting Instructions */}
      <section className={styles.meetingSpot}>
        <div className={styles.meetingText}>
          <h2>Convenient Dockside Pick-Up</h2>
          <p>
            No complicated directions, shuttle buses, or expensive taxi rides. We pick 
            your group up directly at the <strong>Joan Harriss Cruise Pavilion</strong> dockside 
            (where your ship pulls in, right next to the iconic Big Fiddle).
          </p>
          <p>
            Your guide will be waiting holding a clean card with your name on it, ready 
            to escort you to your comfortable air-conditioned SUV or private van. We sync 
            with your arrival time and guarantee to have you back 1 hour before departure.
          </p>
        </div>
        <div className={styles.meetingGraphic}>
          <CruiseWaterTank />
        </div>
      </section>

      {/* Branching Funnel by Port Time */}
      <section className={styles.branchesSection}>
        <h2 className={styles.branchesTitle}>Select Tours by Your Ship&apos;s Port Window</h2>
        <div className={styles.branchGrid}>
          {/* Quick taste branch */}
          <div className={styles.branchCard}>
            <span className={styles.branchDuration}>1–2 Hours Available</span>
            <h3 className={styles.branchName}>Sydney City Scenic Drive</h3>
            <p className={styles.branchDesc}>
              A quick and scenic introduction to Sydney. See the Big Fiddle, Sydney Harbour 
              waterfront, Low Point Lighthouse, and Fort Petrie. Perfect for short ports.
            </p>
            <Link href="/tours/sydney-city-lighthouse" className={styles.branchCTA}>
              View Tour details
            </Link>
          </div>

          {/* Half day branch */}
          <div className={styles.branchCard}>
            <span className={styles.branchDuration}>4–5 Hours Available</span>
            <h3 className={styles.branchName}>Louisbourg Fortress or Bell Museum</h3>
            <p className={styles.branchDesc}>
              Step back into colonial history at the massive French Fortress of Louisbourg, 
              or discover Alexander Graham Bell&apos;s inventions in the village of Baddeck.
            </p>
            <Link href="/tours" className={styles.branchCTA}>
              Explore Options
            </Link>
          </div>

          {/* Full day branch */}
          <div className={styles.branchCard}>
            <span className={styles.branchDuration}>6+ Hours Available</span>
            <h3 className={styles.branchName}>Cabot Trail Scenic Adventure</h3>
            <p className={styles.branchDesc}>
              Our premium private tour. Cruise the world-famous Cabot Trail, hike the Skyline 
              Trail boardwalk, check out Ingonish Beach, and visit local craft studios.
            </p>
            <Link href="/tours/full-cabot-trail" className={styles.branchCTA}>
              View Flagship Tour
            </Link>
          </div>
        </div>
      </section>

      <TrustStrip />
    </div>
  );
}
