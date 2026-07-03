import { tours } from "@/data/tours";
import TourCard from "@/components/TourCard";
import styles from "./tours.module.css";

export default function ToursPage() {
  const quickTaste = tours.filter((t) => t.category === "quick-taste");
  const halfToFullDay = tours.filter((t) => t.category === "half-to-full-day");
  const fullDay = tours.filter((t) => t.category === "full-day");
  const privateCustom = tours.filter((t) => t.category === "private-custom");

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Explore Cape Breton Island</h1>
        <p className={styles.subtitle}>
          Private and small-group journeys tailored to your timeline.
        </p>
      </header>

      {/* Flagship Section First for Anchoring */}
      {fullDay.length > 0 && (
        <section className={styles.section} id="full">
          <h2 className={styles.sectionHeading}>The Flagship Loop</h2>
          <div className={`${styles.grid} ${styles.flagshipGrid}`}>
            {fullDay.map((tour) => (
              <TourCard key={tour.id} tour={tour} variant="flagship" />
            ))}
          </div>
        </section>
      )}

      {/* Half to Full Day Section */}
      {halfToFullDay.length > 0 && (
        <section className={styles.section} id="half">
          <h2 className={styles.sectionHeading}>Half to Full Day Adventures</h2>
          <div className={styles.grid}>
            {halfToFullDay.map((tour) => (
              <TourCard key={tour.id} tour={tour} variant="standard" />
            ))}
          </div>
        </section>
      )}

      {/* Quick Taste Section */}
      {quickTaste.length > 0 && (
        <section className={styles.section} id="quick">
          <h2 className={styles.sectionHeading}>Quick Taste (1–4 Hours)</h2>
          <div className={styles.grid}>
            {quickTaste.map((tour) => (
              <TourCard key={tour.id} tour={tour} variant="standard" />
            ))}
          </div>
        </section>
      )}

      {/* Private Custom Section */}
      {privateCustom.length > 0 && (
        <section className={styles.section} id="private">
          <h2 className={styles.sectionHeading}>Private & Custom Tours</h2>
          <div className={styles.grid}>
            {privateCustom.map((tour) => (
              <TourCard key={tour.id} tour={tour} variant="standard" />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
