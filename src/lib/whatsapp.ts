const WHATSAPP_BASE = 'https://wa.me/19029198971?text=';

/**
 * Builds a pre-filled WhatsApp URL for a tour inquiry.
 * If no tourName is provided, uses a generic message.
 */
export function buildWhatsAppUrl(tourName?: string): string {
  const message = tourName
    ? `Hi Jessie, I'm interested in the ${tourName} tour with City Heart Tours`
    : `Hi Jessie, I'm interested in booking a tour with City Heart Tours`;
  return `${WHATSAPP_BASE}${encodeURIComponent(message)}`;
}

/**
 * Builds a pre-filled WhatsApp URL for cruise-passenger inquiries.
 * Optionally includes the number of port hours available.
 */
export function buildCruiseWhatsAppUrl(portHours?: string): string {
  const message = portHours
    ? `Hi Jessie, I'm a cruise passenger and have ${portHours} in port — I'm interested in a City Heart Tours excursion`
    : `Hi Jessie, I'm a cruise passenger and I'm interested in booking a shore excursion with City Heart Tours`;
  return `${WHATSAPP_BASE}${encodeURIComponent(message)}`;
}
