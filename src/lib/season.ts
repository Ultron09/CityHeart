import type { AvailabilityInfo } from '@/types';

/**
 * Returns true if we are in the seasonal urgency window (late Sep - mid Oct)
 * AND remainingDates < 3.
 * Used to show the "Last few fall foliage dates" banner.
 */
export function isSeasonalUrgency({ remainingDates, currentDate }: AvailabilityInfo): boolean {
  const month = currentDate.getMonth() + 1; // 1–12
  const day = currentDate.getDate();
  const inWindow = (month === 9 && day >= 20) || (month === 10 && day <= 15);
  return inWindow && remainingDates < 3;
}
