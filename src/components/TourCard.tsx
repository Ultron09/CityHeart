import Image from 'next/image';
import Link from 'next/link';
import type { Tour } from '@/types';
import { perPersonEquivalent } from '@/lib/pricing';
import Badge from './ui/Badge';
import BookingCTA from './BookingCTA';
import styles from './TourCard.module.css';

interface TourCardProps {
  tour: Tour;
  variant: 'standard' | 'flagship';
  showPerPersonEquivalent?: boolean;
}

function categoryLabel(category: Tour['category']): string {
  switch (category) {
    case 'quick-taste':
      return 'Quick Taste';
    case 'half-to-full-day':
      return 'Half–Full Day';
    case 'full-day':
      return 'Full Day';
    case 'private-custom':
      return 'Private Custom';
    default:
      return category;
  }
}

export default function TourCard({
  tour,
  variant,
  showPerPersonEquivalent = true,
}: TourCardProps) {
  const imageSizes =
    variant === 'flagship'
      ? '(min-width: 768px) 66vw, 100vw'
      : '(min-width: 768px) 33vw, 100vw';

  const perPerson =
    tour.pricePerGroup && showPerPersonEquivalent
      ? perPersonEquivalent(tour.pricePerGroup, tour.maxGuests)
      : null;

  return (
    <article className={`${styles.card} ${styles[variant]}`}>
      {/* Image wrapper */}
      <Link href={`/tours/${tour.slug}`} tabIndex={-1} aria-hidden="true" className={styles.imageWrapper}>
        <Image
          src={tour.heroImage}
          alt={tour.heroImageAlt}
          fill
          sizes={imageSizes}
          className={styles.image}
        />
        {/* Badges overlay */}
        <div className={styles.badges}>
          {tour.isFlagship && (
            <Badge variant="success">Best Value</Badge>
          )}
          {tour.isDiscounted && (
            <Badge variant="accent">Special Offer</Badge>
          )}
          <Badge>{categoryLabel(tour.category)}</Badge>
        </div>
      </Link>

      {tour.isFlagship && (
        <div className={styles.flagshipBanner} aria-hidden="true">
          ★ Best Value — Private Full-Day
        </div>
      )}

      {/* Body */}
      <div className={styles.body}>
        <h3 className={styles.title}>
          <Link href={`/tours/${tour.slug}`}>
            {tour.title}
          </Link>
        </h3>

        {/* Meta: duration + rating */}
        <div className={styles.meta}>
          <span className={styles.metaItem}>
            <svg
              width="14"
              height="14"
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
            {tour.duration}
          </span>
          {tour.rating !== undefined && tour.reviewCount > 0 && (
            <span className={styles.metaItem}>
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
              {tour.rating.toFixed(1)} ({tour.reviewCount})
            </span>
          )}
        </div>

        {/* Pricing */}
        <div className={styles.priceRow}>
          {tour.pricePerGroup ? (
            <>
              <span className={styles.priceGroup}>
                ${tour.pricePerGroup}/group
              </span>
              {perPerson !== null && (
                <span className={styles.pricePer}>
                  · as low as ~${perPerson}/person (for {tour.maxGuests})
                </span>
              )}
            </>
          ) : tour.pricePerAdult ? (
            <>
              {tour.isDiscounted && tour.originalPrice && (
                <s className={styles.priceStrike}>${tour.originalPrice}</s>
              )}
              <span className={styles.price}>${tour.pricePerAdult}/person</span>
            </>
          ) : null}
        </div>

        {/* CTA */}
        <div className={styles.cta}>
          <BookingCTA
            tourName={tour.title}
            location={`tour-card-${variant}`}
          />
        </div>
      </div>
    </article>
  );
}
