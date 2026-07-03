'use client';
import { useState } from 'react';
import type { Review } from '@/types';
import { truncateReview, highlightGuideNames } from '@/lib/reviews';
import styles from './ReviewCard.module.css';

interface ReviewCardProps {
  review: Review;
  highlightGuides?: boolean;
}

const TRUNCATE_AT = 500;

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

/** Formats "YYYY-MM" to "Month YYYY" */
function formatDate(dateStr: string): string {
  const [year, month] = dateStr.split('-');
  const monthIndex = parseInt(month ?? '1', 10) - 1;
  const monthName = MONTH_NAMES[monthIndex] ?? '';
  return `${monthName} ${year}`;
}

function StarRating({ rating }: { rating: number }) {
  const clamped = Math.max(0, Math.min(5, Math.round(rating)));
  return (
    <span className={styles.stars} aria-hidden="true">
      {Array.from({ length: 5 }, (_, i) => (
        <span
          key={i}
          className={i < clamped ? styles.starFilled : styles.starEmpty}
        >
          ★
        </span>
      ))}
    </span>
  );
}

export default function ReviewCard({ review, highlightGuides = false }: ReviewCardProps) {
  const [expanded, setExpanded] = useState(false);

  const isTruncatable = review.text.length > TRUNCATE_AT;
  const displayText =
    !isTruncatable || expanded ? review.text : truncateReview(review.text, TRUNCATE_AT);

  const formattedDate = formatDate(review.date);
  const ratingLabel = `${Math.round(review.rating)} out of 5 stars`;

  return (
    <article
      className={styles.card}
      aria-label={`Review by ${review.reviewerName}, ${ratingLabel}`}
    >
      {/* Header: stars + reviewer info */}
      <header className={styles.header}>
        <div className={styles.ratingRow}>
          <StarRating rating={review.rating} />
          <span className={styles.srOnly}>{ratingLabel}</span>
        </div>
        <div className={styles.meta}>
          <span className={styles.reviewer}>{review.reviewerName}</span>
          <time className={styles.date} dateTime={review.date}>
            {formattedDate}
          </time>
        </div>
      </header>

      {/* Review text */}
      <div className={styles.body}>
        {highlightGuides ? (
          <p
            className={styles.text}
            /* highlightGuideNames returns HTML string with <strong> tags */
            dangerouslySetInnerHTML={{
              __html: highlightGuideNames(displayText),
            }}
          />
        ) : (
          <p className={styles.text}>{displayText}</p>
        )}

        {isTruncatable && (
          <button
            type="button"
            className={styles.expandButton}
            onClick={() => setExpanded((prev) => !prev)}
            aria-expanded={expanded}
          >
            {expanded ? 'Show less' : 'Read more'}
          </button>
        )}
      </div>
    </article>
  );
}
