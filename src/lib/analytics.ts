// Extend the Window interface to include gtag
declare global {
  interface Window {
    gtag: (
      command: 'event' | 'config' | 'js' | 'set',
      eventNameOrTargetId: string,
      eventParams?: Record<string, unknown>
    ) => void;
  }
}

export type AnalyticsEventName =
  | 'booking_cta_click'
  | 'quiz_completed'
  | 'whatsapp_click'
  | 'tour_page_view'
  | 'review_filter_applied';

export interface AnalyticsEvent {
  name: AnalyticsEventName;
  params?: Record<string, unknown>;
}

/**
 * Fires a GA4 event.
 * No-ops when:
 *   - NEXT_PUBLIC_ANALYTICS_ENABLED is not 'true'
 *   - Running on the server (typeof window === 'undefined')
 *   - window.gtag is not available
 */
export function trackEvent(event: AnalyticsEvent): void {
  if (process.env.NEXT_PUBLIC_ANALYTICS_ENABLED !== 'true') return;
  if (typeof window === 'undefined') return;
  if (typeof window.gtag !== 'function') return;

  window.gtag('event', event.name, event.params);
}

/**
 * Convenience wrapper for booking CTA clicks.
 */
export function trackBookingCtaClick(tourName: string, location: string): void {
  trackEvent({
    name: 'booking_cta_click',
    params: { tour_name: tourName, cta_location: location },
  });
}

/**
 * Convenience wrapper for quiz completion.
 */
export function trackQuizCompleted(recommendedSlug: string, answers: Record<string, unknown>): void {
  trackEvent({
    name: 'quiz_completed',
    params: { recommended_tour: recommendedSlug, ...answers },
  });
}

/**
 * Convenience wrapper for WhatsApp link clicks.
 */
export function trackWhatsAppClick(context: string): void {
  trackEvent({
    name: 'whatsapp_click',
    params: { context },
  });
}
