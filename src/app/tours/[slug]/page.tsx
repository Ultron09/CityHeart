export default function TourDetailPage({ params }: { params: { slug: string } }) {
  return (
    <div style={{ padding: '4rem 2rem' }}>
      <h1>Tour Detail: {params.slug}</h1>
      <p>Sticky price CTA and visual itinerary will go here.</p>
    </div>
  );
}
