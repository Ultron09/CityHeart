"use client";

import Accordion from "@/components/ui/Accordion";
import TrustStrip from "@/components/TrustStrip";
import styles from "./faq.module.css";

export default function FAQPage() {
  const faqItems = [
    {
      id: "1",
      label: "What happens if our cruise ship cannot dock in Sydney?",
      content: (
        <p>
          We offer a <strong>100% Back-to-Ship Guarantee</strong>. If your cruise ship 
          is unable to dock at Sydney Port due to bad weather or schedule changes, 
          simply notify us and we will issue a full refund immediately. No questions asked.
        </p>
      )
    },
    {
      id: "2",
      label: "Where do we meet you when we disembark?",
      content: (
        <p>
          We pick up directly at the <strong>Joan Harriss Cruise Pavilion</strong> dockside. 
          Your guide will be waiting right outside the pedestrian exit gate holding a 
          greeting card with your name printed clearly on it. No shuttles or walking required.
        </p>
      )
    },
    {
      id: "3",
      label: "Are your tours private or shared?",
      content: (
        <p>
          We offer <strong>fully private tours</strong>. When you book a tour with us, 
          your group gets the entire vehicle (SUV or passenger van) and guide to yourselves. 
          This lets us customize stops, pick-up times, and duration on the fly.
        </p>
      )
    },
    {
      id: "4",
      label: "What is your vehicle capacity and configuration?",
      content: (
        <p>
          We operate late-model, clean, air-conditioned Dodge Durango SUVs (up to 6 guests) 
          and larger passenger vans (Ford Transit class). Every seat is equipped with 
          working seatbelts, and we enforce a maximum passenger count to ensure nobody 
          is uncomfortably squeezed into third-row or middle seats.
        </p>
      )
    },
    {
      id: "5",
      label: "Is my driver also my tour guide?",
      content: (
        <p>
          Yes! We promise that your driver is also your <strong>English-fluent, local guide</strong>. 
          They are knowledgeable local storytellers who will narrate the history, point out 
          landmarks, and share personal stories about Cape Breton throughout the drive.
        </p>
      )
    },
    {
      id: "6",
      label: "What is your cancellation and weather policy?",
      content: (
        <p>
          You can cancel your booking for a full refund up to <strong>24 hours</strong> before 
          your scheduled start time. Tours run rain or shine, but in cases of severe storm 
          warnings where safety is compromised, we will contact you to reschedule or issue a 
          full refund.
        </p>
      )
    }
  ];

  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <h1 className={styles.title}>Good to Know</h1>
        <p className={styles.subtitle}>
          Frequently asked questions about port pickups, vehicles, and cancellation policies.
        </p>
      </header>

      {/* Accordion list */}
      <div className={styles.accordionWrapper}>
        <Accordion items={faqItems} allowMultiple={true} />
      </div>

      <div style={{ marginTop: "4rem" }}>
        <TrustStrip />
      </div>
    </div>
  );
}
