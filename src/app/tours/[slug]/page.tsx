import { getTourBySlug, tours } from "@/data/tours";
import { notFound } from "next/navigation";
import Image from "next/image";
import PricePanel from "@/components/PricePanel";
import StopItinerary from "@/components/StopItinerary";
import TourMap from "@/components/TourMap";
import TrustStrip from "@/components/TrustStrip";
import styles from "./tour-detail.module.css";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return tours.map((tour) => ({
    slug: tour.slug,
  }));
}

export default async function TourDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const tour = getTourBySlug(slug);

  if (!tour) {
    notFound();
  }

  // Choose correct illustrated map based on tour
  const mapImage = tour.slug === "full-cabot-trail" 
    ? "/images/tours/full-cabot-trail/map.png"
    : "/images/placeholder-map.png";

  return (
    <article className={styles.detailPage}>
      {/* Hero Header */}
      <section 
        className={styles.hero} 
        style={{ backgroundImage: `url(${tour.heroImage})` }}
      >
        <div className={styles.heroGradient} />
        <div className={styles.heroContent}>
          <span className={styles.categoryTag}>
            {tour.category.replace(/-/g, " ")}
          </span>
          <h1 className={styles.title}>{tour.title}</h1>
          <div className={styles.metaRow}>
            <span>🕒 {tour.duration}</span>
            <span>👥 Max {tour.maxGuests} guests</span>
            {tour.rating && (
              <span>★ {tour.rating} ({tour.reviewCount} Reviews)</span>
            )}
          </div>
        </div>
      </section>

      {/* Trust Strip */}
      <TrustStrip variant="compact" />

      {/* Main Split Grid */}
      <div className={styles.grid}>
        {/* Left Column: Itinerary and Details */}
        <div className={styles.mainContent}>
          {/* Overview */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Tour Overview</h2>
            <p className={styles.description}>{tour.shortDescription}</p>
          </section>

          {/* Route Map */}
          <section className={styles.section}>
            <TourMap stopsCount={tour.stops.length} mapImageUrl={mapImage} />
          </section>

          {/* Itinerary Stops */}
          <StopItinerary stops={tour.stops} tourName={tour.title} />

          {/* Inclusions & Exclusions */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>What’s Included & Excluded</h2>
            <div className={styles.inoutGrid}>
              <div className={styles.inoutCol}>
                <h4>Included</h4>
                <ul className={styles.inoutList}>
                  <li className={styles.inoutItem}>
                    <span className={styles.checkIcon}>✓</span>
                    <span>Air-conditioned vehicle transport</span>
                  </li>
                  <li className={styles.inoutItem}>
                    <span className={styles.checkIcon}>✓</span>
                    <span>Local local driver & guide team</span>
                  </li>
                  <li className={styles.inoutItem}>
                    <span className={styles.checkIcon}>✓</span>
                    <span>Bottled water for all passengers</span>
                  </li>
                </ul>
              </div>
              <div className={styles.inoutCol}>
                <h4>Excluded</h4>
                <ul className={styles.inoutList}>
                  <li className={styles.inoutItem}>
                    <span className={styles.crossIcon}>✗</span>
                    <span>Meals and beverages (brunch stops planned)</span>
                  </li>
                  <li className={styles.inoutItem}>
                    <span className={styles.crossIcon}>✗</span>
                    <span>Attraction admission fees (unless specified)</span>
                  </li>
                  <li className={styles.inoutItem}>
                    <span className={styles.crossIcon}>✗</span>
                    <span>Gratuities for your guides</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Explicit Vehicle Promise */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Our Vehicles & Safety</h2>
            <div className={styles.vehicleCard}>
              <div className={styles.vehicleImageWrapper}>
                <Image
                  src={tour.vehicleImage}
                  alt={tour.vehicleImageAlt}
                  fill
                  style={{ objectFit: "cover" }}
                />
              </div>
              <div className={styles.vehicleDetails}>
                <h4>Comfortable Small-Group Travel</h4>
                <p>
                  We operate fully private, well-maintained SUVs (Dodge Durango class) 
                  and spacious vans (Ford Transit class) to guarantee comfort. Seatbelts 
                  for all passengers, full climate control, and generous window space 
                  ensure you don&apos;t miss any of the beautiful Cape Breton scenery.
                </p>
              </div>
            </div>
          </section>
        </div>

        {/* Right Column: Sticky Booking Widget & Details */}
        <div className={styles.sidebar}>
          {/* Price panel containing Reserve CTA */}
          <PricePanel
            pricePerGroup={tour.pricePerGroup}
            pricePerAdult={tour.pricePerAdult}
            maxGuests={tour.maxGuests}
            tourName={tour.title}
          />

          {/* Guide Promise card */}
          <div className={styles.guideCard}>
            <div className={styles.guideAvatar}>
              <Image
                src="/images/guides/jessie.jpg"
                alt="Jessie, your Cape Breton guide"
                fill
                style={{ objectFit: "cover" }}
              />
            </div>
            <div className={styles.guideInfo}>
              <h4>The Guide Guarantee</h4>
              <p>
                Your driver is also your guide — English-fluent, Cape Breton local. 
                Come as a guest, leave as a friend!
              </p>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
