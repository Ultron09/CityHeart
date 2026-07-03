import styles from './TrustStrip.module.css';

interface TrustStripProps {
  variant?: 'default' | 'compact';
}

const UsersIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    className={styles.itemIcon}
  >
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const ShieldIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    className={styles.itemIcon}
  >
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <path d="M9 12l2 2 4-4" />
  </svg>
);

const CalendarIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    className={styles.itemIcon}
  >
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
    <path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01" />
  </svg>
);

const trustItems = [
  {
    icon: <UsersIcon />,
    text: 'Private tours, max 6 guests · Seatbelts for all',
  },
  {
    icon: <ShieldIcon />,
    text: 'Your driver is also your guide — English-fluent, Cape Breton local',
  },
  {
    icon: <CalendarIcon />,
    text: 'Free cancellation up to 24 hours · Plans change, we get it',
  },
];

export default function TrustStrip({ variant = 'default' }: TrustStripProps) {
  return (
    <section
      aria-label="Why book with City Heart Tours"
      className={`${styles.strip} ${variant === 'compact' ? styles.compact : ''}`}
    >
      <ul className={styles.list} role="list">
        {trustItems.map((item, index) => (
          <li key={index} className={styles.item}>
            <span className={styles.iconWrapper}>{item.icon}</span>
            <span className={styles.text}>{item.text}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
