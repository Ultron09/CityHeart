/**
 * Calculates the per-person equivalent price from a group price.
 * Used to surface the true value of group-priced tours.
 */
export function perPersonEquivalent(groupPrice: number, groupSize: number): number {
  return Math.round(groupPrice / groupSize);
}

/**
 * Formats a price amount as a dollar string.
 * e.g. 138 → "$138"
 */
export function formatPrice(amount: number): string {
  return `$${amount.toLocaleString()}`;
}

/**
 * Formats a group price with per-person equivalent framing.
 * e.g. "$830/group · ~$138/person for 6"
 */
export function formatGroupPrice(groupPrice: number, maxGuests = 6): string {
  const pp = perPersonEquivalent(groupPrice, maxGuests);
  return `$${groupPrice}/group · ~$${pp}/person for ${maxGuests}`;
}
