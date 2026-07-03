import type { QuizAnswers, Tour, TourCategory } from '@/types';
import { TIER_ORDER, RECOMMENDATION_MAP } from '@/data/quiz';

/**
 * Returns the recommended tour slug for a given set of quiz answers.
 * Deterministic rules:
 *   - 1-2h → sydney-city-lighthouse (always)
 *   - 8-10h → full-cabot-trail (always)
 *   - mid-tier → resolved by interest via RECOMMENDATION_MAP
 */
export function buildYourDayRecommendation(answers: QuizAnswers): string {
  const { time, interest } = answers;

  if (time === '1-2h') return 'sydney-city-lighthouse';
  if (time === '8-10h') return 'full-cabot-trail';

  return RECOMMENDATION_MAP[time][interest] ?? RECOMMENDATION_MAP[time]['default'];
}

/**
 * Returns the next-tier tour after the recommended one, for the secondary suggestion.
 * Returns null if there is no next tier.
 */
export function getSecondaryTour(recommendedSlug: string, tours: Tour[]): Tour | null {
  const recommended = tours.find((t) => t.slug === recommendedSlug);
  if (!recommended) return null;

  const currentTierIndex = TIER_ORDER.indexOf(recommended.category as TourCategory);
  const nextTier = TIER_ORDER[currentTierIndex + 1];
  if (!nextTier) return null;

  return tours.find((t) => t.category === nextTier) ?? null;
}

/**
 * Validates that a group size value is a whole number between 1 and 6.
 */
export function validateGroupSize(value: unknown): { valid: boolean; error?: string } {
  const n = Number(value);
  if (!Number.isInteger(n)) return { valid: false, error: 'Please enter a whole number' };
  if (n < 1) return { valid: false, error: 'Group size must be at least 1' };
  if (n > 6) return { valid: false, error: 'Maximum group size is 6 — contact us for larger groups' };
  return { valid: true };
}
