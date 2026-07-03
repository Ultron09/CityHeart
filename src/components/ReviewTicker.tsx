import styles from './ReviewTicker.module.css';

export default function ReviewTicker() {
  return (
    <div className={styles.tickerContainer}>
      <h2 className={styles.title}>What Our Guests Say</h2>
      <div className={styles.tickerTrack}>
        <div className={styles.reviewSnippet}>"Absolutely phenomenal... best tour in Cape Breton!"</div>
        <div className={styles.reviewSnippet}>"Jessie was amazing. So knowledgeable and friendly."</div>
        <div className={styles.reviewSnippet}>"The small group made it feel so personal and special."</div>
      </div>
    </div>
  );
}
