export type TourCategory = 'quick-taste' | 'half-to-full-day' | 'full-day' | 'private-custom';

export interface Stop {
  order: number;
  name: string;
  description: string;
  durationHint?: string;
  imageUrl: string;
  imageAlt: string;
}

export interface Tour {
  id: string;
  slug: string;
  title: string;
  duration: string;
  durationHours: [number, number];
  pricePerAdult?: number;
  pricePerGroup?: number;
  maxGuests: number;
  rating?: number;
  reviewCount: number;
  category: TourCategory;
  stops: Stop[];
  heroImage: string;
  heroImageAlt: string;
  vehicleImage: string;
  vehicleImageAlt: string;
  isDiscounted: boolean;
  originalPrice?: number;
  isFlagship: boolean;
  format: 'private' | 'private-small-group';
  metaDescription: string;
  shortDescription: string;
  highlights: string[];
}

export interface Review {
  id: string;
  tourSlug?: string;
  reviewerName: string;
  rating: number;
  date: string; // "YYYY-MM"
  text: string;
  mentionsGuide?: 'jessie' | 'kv' | 'both';
}

export interface ReviewExcerpt {
  id: string;
  text: string;
  reviewer: string;
  rating: number;
  tourSlug?: string;
}

export type TimeOption = '1-2h' | '4-5h' | '5-7h' | '8-10h';
export type InterestOption = 'nature' | 'history' | 'mixed' | 'coastal';

export interface QuizAnswers {
  time: TimeOption;
  interest: InterestOption;
  groupSize: number;
}

export interface BookingInquiry {
  fullName: string;
  email: string;
  phone?: string;
  tourSlug: string;
  preferredDate: string;
  groupSize: number;
  message?: string;
}

export interface BookingFormErrors {
  fullName?: string;
  email?: string;
  tourSlug?: string;
  preferredDate?: string;
  groupSize?: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: BookingFormErrors;
}

export interface AvailabilityInfo {
  remainingDates: number;
  currentDate: Date;
}
