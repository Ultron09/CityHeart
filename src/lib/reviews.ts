import type { Review } from '@/types';
import { staticReviews } from '@/data/reviews';

/**
 * Filters reviews by tour slug, or returns all reviews if 'all' is passed.
 */
export function filterReviewsByTour(
  reviews: Review[],
  tourSlug: string | 'all'
): Review[] {
  if (tourSlug === 'all') return reviews;
  return reviews.filter((r) => r.tourSlug === tourSlug);
}

/**
 * Filters to reviews that mention guide names (Jessie, KV, Kulveer) in the text.
 */
export function filterGuideReviews(reviews: Review[]): Review[] {
  const pattern = /\b(jessie|kv|kulveer)\b/i;
  return reviews.filter((r) => pattern.test(r.text));
}

/**
 * Truncates review text to maxLength characters, appending an ellipsis if truncated.
 */
export function truncateReview(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trimEnd() + '…';
}

/**
 * Wraps guide names in <strong> tags for visual highlighting.
 * Returns the modified string — caller must render as HTML (dangerouslySetInnerHTML).
 */
export function highlightGuideNames(text: string): string {
  return text.replace(/\b(Jessie|KV|Kulveer)\b/gi, '<strong>$1</strong>');
}

/**
 * Returns at least `minimum` reviews for a tour page.
 * If the tour doesn't have enough specific reviews, fills with sitewide reviews.
 */
export function getTourPageReviews(
  allReviews: Review[],
  tourSlug: string,
  minimum = 3
): Review[] {
  const tourReviews = filterReviewsByTour(allReviews, tourSlug);
  if (tourReviews.length >= minimum) return tourReviews.slice(0, minimum);
  const sitewide = allReviews.filter((r) => !r.tourSlug);
  return [...tourReviews, ...sitewide].slice(0, minimum);
}

/**
 * Interleaves a 'CTA' marker after every `interval` reviews.
 * e.g. interleaveCtaAfterEvery(reviews, 3) places 'CTA' after indexes 2, 5, 8, ...
 */
export function interleaveCtaAfterEvery(
  reviews: Review[],
  interval: number
): Array<Review | 'CTA'> {
  return reviews.flatMap((review, index) =>
    (index + 1) % interval === 0 ? [review, 'CTA'] : [review]
  );
}

/**
 * Fetches reviews, optionally from the TripAdvisor API if TRIPADVISOR_API_KEY is set.
 * Falls back to the static review seed on any failure.
 */
export async function getReviews(): Promise<Review[]> {
  if (process.env.TRIPADVISOR_API_KEY) {
    try {
      const res = await fetch(
        `https://api.content.tripadvisor.com/api/v1/location/LOCATION_ID/reviews?key=${process.env.TRIPADVISOR_API_KEY}`,
        { next: { revalidate: 86400 } } as RequestInit & { next?: { revalidate: number } }
      );
      if (!res.ok) throw new Error('TripAdvisor API error');
      const data = await res.json() as { data: unknown[] };
      return transformTripAdvisorReviews(data.data);
    } catch {
      // Fall through to static seed
    }
  }
  return staticReviews;
}

/**
 * Transforms TripAdvisor API response data into our Review[] shape.
 * Used internally by getReviews.
 */
function transformTripAdvisorReviews(data: unknown[]): Review[] {
  return data.map((item, index) => {
    const review = item as Record<string, unknown>;
    const user = review.user as Record<string, unknown> | undefined;
    const rating = review.rating as Record<string, unknown> | undefined;
    const publishedDate = typeof review.published_date === 'string'
      ? review.published_date.slice(0, 7)
      : '2024-01';

    return {
      id: `ta-${String(review.id ?? index)}`,
      tourSlug: undefined,
      reviewerName: typeof user?.username === 'string' ? user.username : 'Traveller',
      rating: typeof rating?.overall === 'number' ? rating.overall : 5,
      date: publishedDate,
      text: typeof review.text === 'string' ? review.text : '',
    } satisfies Review;
  });
}
