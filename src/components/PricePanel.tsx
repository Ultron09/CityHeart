import styles from './PricePanel.module.css';
import BookingCTA from './BookingCTA';

interface PricePanelProps {
  pricePerGroup?: number;
  pricePerAdult?: number;
  maxGuests?: number;
  tourName: string;
}

export default function PricePanel({ pricePerGroup, pricePerAdult, maxGuests, tourName }: PricePanelProps) {
  const perPerson = pricePerGroup && maxGuests ? Math.round(pricePerGroup / maxGuests) : null;

  return (
    <div className={styles.stickyPanel}>
      <div className={styles.priceInfo}>
        {pricePerGroup ? (
          <>
            <div className={styles.mainPrice}>${pricePerGroup} / group</div>
            {perPerson && <div className={styles.subPrice}>as low as ~${perPerson}/person (for {maxGuests})</div>}
          </>
        ) : (
          <div className={styles.mainPrice}>${pricePerAdult} / person</div>
        )}
      </div>
      <div className={styles.ctaWrapper}>
        <BookingCTA tourName={tourName} location="sticky_panel" size="large" label="Reserve Now" />
      </div>
    </div>
  );
}
