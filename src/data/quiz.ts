import type { TimeOption, InterestOption, TourCategory } from '@/types';

export const TIME_OPTIONS: Array<{ value: TimeOption; label: string; description: string }> = [
  {
    value: '1-2h',
    label: '1–2 hours',
    description: 'Quick coastal highlights — perfect for cruise passengers',
  },
  {
    value: '4-5h',
    label: '4–5 hours',
    description: 'Half-day adventure with a major historic or scenic destination',
  },
  {
    value: '5-7h',
    label: '5–7 hours',
    description: 'Extended day with cultural depth and scenic variety',
  },
  {
    value: '8-10h',
    label: '8–10 hours',
    description: 'Full Cabot Trail loop — the complete Cape Breton experience',
  },
];

export const INTEREST_OPTIONS: Array<{ value: InterestOption; label: string; description: string }> = [
  {
    value: 'nature',
    label: 'Nature & scenery',
    description: 'Highlands, coastlines, wildlife, and scenic trails',
  },
  {
    value: 'history',
    label: 'History & culture',
    description: 'Fortresses, museums, Acadian & Gaelic heritage',
  },
  {
    value: 'mixed',
    label: 'A bit of everything',
    description: 'Mix of scenery, culture, and local flavour',
  },
  {
    value: 'coastal',
    label: 'Coastal & beaches',
    description: 'Lighthouses, sea cliffs, beaches, and harbour towns',
  },
];

export const TIER_ORDER: TourCategory[] = [
  'quick-taste',
  'half-to-full-day',
  'full-day',
  'private-custom',
];

/**
 * Recommendation map for mid-tier time slots.
 * Keys: TimeOption → InterestOption (or 'default')
 * Values: tour slug
 */
export const RECOMMENDATION_MAP: Record<string, Record<string, string>> = {
  '4-5h': {
    nature: 'louisbourg-fortress',
    history: 'louisbourg-fortress',
    mixed: 'louisbourg-fortress',
    coastal: 'louisbourg-fortress',
    default: 'louisbourg-fortress',
  },
  '5-7h': {
    nature: 'cabot-trail-ingonish',
    history: 'bell-museum-mini-cabot',
    mixed: 'cabot-trail-ingonish',
    coastal: 'cabot-trail-ingonish',
    default: 'cabot-trail-ingonish',
  },
};
