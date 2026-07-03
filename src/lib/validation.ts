import type { BookingInquiry, BookingFormErrors, ValidationResult } from '@/types';
import { validateGroupSize } from '@/lib/quiz';

export { validateGroupSize } from '@/lib/quiz';

/**
 * Validates a booking form submission.
 * Returns a ValidationResult with isValid flag and any field errors.
 */
export function validateBookingForm(data: Partial<BookingInquiry>): ValidationResult {
  const errors: BookingFormErrors = {};

  if (!data.fullName?.trim()) {
    errors.fullName = 'Full name is required';
  }

  if (!data.email?.trim()) {
    errors.email = 'Email address is required';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = 'Please enter a valid email address';
  }

  if (!data.tourSlug) {
    errors.tourSlug = 'Please select a tour';
  }

  if (!data.preferredDate) {
    errors.preferredDate = 'Please select a preferred date';
  }

  if (data.groupSize == null) {
    errors.groupSize = 'Group size is required';
  } else {
    const sizeResult = validateGroupSize(data.groupSize);
    if (!sizeResult.valid) {
      errors.groupSize = sizeResult.error;
    }
  }

  return { isValid: Object.keys(errors).length === 0, errors };
}
