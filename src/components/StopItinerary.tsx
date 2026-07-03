import Image from 'next/image';
import type { Stop } from '@/types';
import styles from './StopItinerary.module.css';

interface StopItineraryProps {
  stops: Stop[];
  tourName: string;
}

export default function StopItinerary({ stops, tourName }: StopItineraryProps) {
  return (
    <section className={styles.wrapper} aria-label={`${tourName} itinerary`}>
      <h2 className={styles.heading}>What You&apos;ll See</h2>
      <ol className={styles.list}>
        {stops.map((stop) => (
          <li key={stop.order} className={styles.item}>
            {/* Text column */}
            <div className={styles.textCol}>
              <span className={styles.number} aria-hidden="true">
                {stop.order}
              </span>
              <h3 className={styles.stopName}>{stop.name}</h3>
              <p className={styles.description}>{stop.description}</p>
              {stop.durationHint && (
                <span className={styles.durationHint}>
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                  {stop.durationHint}
                </span>
              )}
            </div>

            {/* Image column */}
            <div className={styles.imageCol}>
              <Image
                src={stop.imageUrl}
                alt={`${stop.name} — ${stop.imageAlt}`}
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className={styles.image}
              />
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
