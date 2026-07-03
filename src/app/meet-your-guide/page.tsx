import Image from "next/image";
import Link from "next/link";
import TrustStrip from "@/components/TrustStrip";
import styles from "./guide.module.css";

export default function MeetYourGuidePage() {
  return (
    <div className={styles.container}>
      <div className={styles.layout}>
        {/* Profile Card Sidebar */}
        <aside className={styles.stickySide}>
          <div className={styles.profileCard}>
            <div className={styles.imageWrapper}>
              <Image
                src="/images/guides/jessie.jpg"
                alt="Jaswinder 'Jessie' Singh - City Heart Tours Founder"
                fill
                style={{ objectFit: "cover" }}
              />
            </div>
            <h2 className={styles.name}>Jaswinder Singh</h2>
            <div className={styles.role}>Founder & Lead Guide</div>
            <p className={styles.badgeItem}>
              &quot;Come as a guest, leave as a friend.&quot;
            </p>
            <div className={styles.badgeList}>
              <span className={styles.badgeItem}>✓ Local Sydney resident</span>
              <span className={styles.badgeItem}>✓ English & Punjabi speaking</span>
              <span className={styles.badgeItem}>✓ 4.5★ TripAdvisor rating</span>
            </div>
          </div>
        </aside>

        {/* Story Section */}
        <main className={styles.mainCol}>
          <h1 className={styles.title}>The Heart Behind City Heart Tours</h1>
          
          <div className={styles.content}>
            <p>
              Hello! I am <strong>Jaswinder &quot;Jessie&quot; Singh</strong>. I founded City Heart Tours 
              with a simple promise: to show you Cape Breton not as a tourist in a crowded coach, 
              but as a friend riding along in my own car.
            </p>

            <blockquote className={styles.quoteBlock}>
              &quot;Cape Breton isn&apos;t just a landscape you look at. It&apos;s a place of music, 
              ancient hills, Acadian fishing villages, and Gaelic stories. I want you to feel that heartbeat.&quot;
            </blockquote>

            <p>
              After moving to Sydney, Nova Scotia, I fell completely in love with the island&apos;s 
              dramatic coastlines, the hospitality of the local communities, and the incredible history 
              of the Cabot Trail. I started guiding because I noticed that big commercial bus excursions 
              routinely drive right past the best lookouts, the most delicious artisan bakeries, and the 
              hidden trails that locals cherish.
            </p>

            <p>
              When you book a day with me or my team, you get a fully private experience. We can adjust 
              our itinerary on the fly. If you want to linger at the Skyline Trail boardwalk, or stop 
              for lunch overlooking the Bras d&apos;Or Lake, we do it. The day is yours.
            </p>

            {/* Our Guide Promises */}
            <div className={styles.guaranteeSection}>
              <h3 className={styles.guaranteeTitle}>The Guide Guarantee</h3>
              <div className={styles.guaranteeGrid}>
                <div className={styles.guaranteeCard}>
                  <h5>Your Driver is Your Guide</h5>
                  <p>
                    Unlike OTA bookings that hire simple third-party transport, I or a local, 
                    English-fluent Cape Breton storyteller will be at the wheel, narrating the history 
                    and sharing local tales.
                  </p>
                </div>
                <div className={styles.guaranteeCard}>
                  <h5>No Rush Policy</h5>
                  <p>
                    Cruise schedules can be tight. We sync directly with your ship&apos;s departure times 
                    and guarantee to return you back to Sydney Port with time to spare.
                  </p>
                </div>
                <div className={styles.guaranteeCard}>
                  <h5>Intimate & Safe</h5>
                  <p>
                    All tours run in comfortable SUVs (max 6 guests) or vans with seatbelts, active 
                    climate control, and clean interiors.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      <div style={{ marginTop: "4rem" }}>
        <TrustStrip />
      </div>
    </div>
  );
}
