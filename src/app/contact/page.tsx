import WhatsAppButton from "@/components/WhatsAppButton";
import TrustStrip from "@/components/TrustStrip";
import styles from "./contact.module.css";

export default function ContactPage() {
  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <h1 className={styles.title}>Plan Your Journey</h1>
        <p className={styles.subtitle}>
          Have questions or want to customize an itinerary? Get in touch with Jessie today.
        </p>
      </header>

      {/* Grid container */}
      <div className={styles.grid}>
        {/* Info Column */}
        <aside className={styles.contactInfo}>
          <div className={styles.infoBlock}>
            <h3>Direct Contact</h3>
            <p>
              Feel free to call or text me directly. As I am often out driving 
              tours, messaging via WhatsApp is usually the fastest way to get a reply.
            </p>
          </div>

          <div className={styles.infoBlock}>
            <h3>📍 Location & Service Area</h3>
            <p>
              City Heart Tours based in Sydney, Cape Breton Island, Nova Scotia. 
              We offer port pickups, hotel collections, and airport transfers 
              across the region.
            </p>
          </div>

          <div className={styles.infoBlock}>
            <h3>📞 Phone Support</h3>
            <p>
              Mobile: <a href="tel:+19029198971" style={{ color: "var(--color-primary)", fontWeight: "bold" }}>+1 (902) 919-8971</a>
            </p>
          </div>

          {/* Quick WhatsApp Chat */}
          <div className={styles.quickChat}>
            <h4>Instant Chat Option</h4>
            <p>Click below to open a direct WhatsApp chat window with Jessie.</p>
            <WhatsAppButton variant="inline" label="Chat on WhatsApp" />
          </div>
        </aside>

        {/* Form Column */}
        <main className={styles.formCard}>
          <h2 className={styles.formTitle}>Send an Inquiry</h2>
          <form className={styles.form}>
            <div className={styles.field}>
              <label htmlFor="name">Your Name</label>
              <input type="text" id="name" required className={styles.input} placeholder="John Doe" />
            </div>

            <div className={styles.field}>
              <label htmlFor="email">Email Address</label>
              <input type="email" id="email" required className={styles.input} placeholder="john@example.com" />
            </div>

            <div className={styles.field}>
              <label htmlFor="tour">Interested Tour</label>
              <select id="tour" className={styles.select}>
                <option value="full-cabot-trail">Full Cabot Trail Tour (Flagship)</option>
                <option value="cabot-trail-ingonish">Cabot Trail, Ingonish & Green Cove</option>
                <option value="louisbourg-fortress">Louisbourg Fortress Tour</option>
                <option value="sydney-city-lighthouse">Sydney City Scenic Drive</option>
                <option value="sydney-root-wildlife">Sydney Roots & Wildlife</option>
                <option value="iona-highland-village-tour">Iona Highland Village</option>
                <option value="alexander-bell-museum-tour">Bell Museum & Baddeck</option>
                <option value="custom">Custom Private Itinerary</option>
              </select>
            </div>

            <div className={styles.field}>
              <label htmlFor="date">Travel Date</label>
              <input type="date" id="date" className={styles.input} />
            </div>

            <div className={styles.field}>
              <label htmlFor="message">Group Size & Message</label>
              <textarea
                id="message"
                required
                className={styles.textarea}
                placeholder="Let me know how many guests in your group, ship docking times, or any customization requests..."
              />
            </div>

            <button type="submit" className={styles.submitBtn}>
              Send Message
            </button>
          </form>
        </main>
      </div>

      <div style={{ marginTop: "4rem" }}>
        <TrustStrip />
      </div>
    </div>
  );
}
