import Image from 'next/image';
import styles from './TourMap.module.css';

interface TourMapProps {
  mapImageUrl?: string;
  stopsCount: number;
}

export default function TourMap({ mapImageUrl = '/images/placeholder-map.png', stopsCount }: TourMapProps) {
  return (
    <div className={styles.mapContainer}>
      <h3 className={styles.mapTitle}>Route Overview ({stopsCount} Stops)</h3>
      <div className={styles.imageWrapper}>
        {/* Visual Route Map for the Tour */}
        <Image 
          src={mapImageUrl} 
          alt="Illustrated route map of the tour" 
          fill 
          sizes="(max-width: 768px) 100vw, 800px"
          style={{ objectFit: 'contain' }}
        />
      </div>
    </div>
  );
}
