'use client';

import React, { useCallback, useId, useRef, useState } from 'react';
import styles from './Accordion.module.css';

// ---- Types ----------------------------------------------------------------

export interface AccordionItem {
  /** Unique key for this item */
  id: string;
  /** Trigger / heading text */
  label: React.ReactNode;
  /** Expandable panel content */
  content: React.ReactNode;
  /** Prevent this item from being toggled */
  disabled?: boolean;
}

export interface AccordionProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Array of accordion items to render */
  items: AccordionItem[];
  /**
   * Allow multiple panels to be open at the same time.
   * Defaults to false (single-open, like a traditional accordion).
   */
  allowMultiple?: boolean;
  /** IDs of items that should be expanded by default */
  defaultOpen?: string[];
}

// ---- Chevron Icon ---------------------------------------------------------

const ChevronDown: React.FC = () => (
  <svg
    className={styles.chevron}
    viewBox="0 0 24 24"
    aria-hidden="true"
    focusable="false"
  >
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

// ---- Individual Accordion Item --------------------------------------------

interface AccordionItemInternalProps {
  item: AccordionItem;
  isOpen: boolean;
  onToggle: (id: string) => void;
  triggerId: string;
  panelId: string;
}

const AccordionItemComponent: React.FC<AccordionItemInternalProps> = ({
  item,
  isOpen,
  onToggle,
  triggerId,
  panelId,
}) => {
  const panelRef = useRef<HTMLDivElement>(null);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLButtonElement>) => {
      // Enter / Space are handled natively by <button>, but we keep the
      // handler here so the parent can intercept ArrowUp/ArrowDown for
      // group-level navigation (dispatched via onKeyDown prop forwarding).
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        if (!item.disabled) onToggle(item.id);
      }
    },
    [item.disabled, item.id, onToggle],
  );

  return (
    <div className={styles.item}>
      {/* ---- Trigger ---- */}
      <button
        id={triggerId}
        type="button"
        aria-expanded={isOpen}
        aria-controls={panelId}
        aria-disabled={item.disabled || undefined}
        disabled={item.disabled}
        className={styles.trigger}
        onClick={() => !item.disabled && onToggle(item.id)}
        onKeyDown={handleKeyDown}
      >
        <span>{item.label}</span>
        <span className={styles.icon} aria-hidden="true">
          <ChevronDown />
        </span>
      </button>

      {/* ---- Panel ---- */}
      <div
        id={panelId}
        ref={panelRef}
        role="region"
        aria-labelledby={triggerId}
        className={[
          styles.panel,
          !isOpen ? styles.panelCollapsed : '',
        ]
          .filter(Boolean)
          .join(' ')}
        hidden={!isOpen}
      >
        <div className={styles.panelInner}>{item.content}</div>
      </div>
    </div>
  );
};

// ---- Accordion Root -------------------------------------------------------

/**
 * Accordion — accessible expand/collapse component.
 *
 * Keyboard interactions:
 * - Enter / Space  → toggle the focused item
 * - ArrowDown      → move focus to the next trigger
 * - ArrowUp        → move focus to the previous trigger
 * - Home           → move focus to the first trigger
 * - End            → move focus to the last trigger
 *
 * ARIA:
 * - Each trigger has `aria-expanded` and `aria-controls`
 * - Each panel has `role="region"` and `aria-labelledby`
 */
const Accordion = React.forwardRef<HTMLDivElement, AccordionProps>(
  (
    {
      items,
      allowMultiple = false,
      defaultOpen = [],
      className,
      ...rest
    },
    ref,
  ) => {
    const baseId = useId();
    const [openItems, setOpenItems] = useState<Set<string>>(
      new Set(defaultOpen),
    );

    const toggleItem = useCallback(
      (id: string) => {
        setOpenItems((prev) => {
          const next = new Set(prev);
          if (next.has(id)) {
            next.delete(id);
          } else {
            if (!allowMultiple) next.clear();
            next.add(id);
          }
          return next;
        });
      },
      [allowMultiple],
    );

    // ---- Keyboard navigation between triggers ----------------------------
    const handleGroupKeyDown = useCallback(
      (e: React.KeyboardEvent<HTMLDivElement>) => {
        const triggers = Array.from(
          (e.currentTarget as HTMLDivElement).querySelectorAll<HTMLButtonElement>(
            `button[id^="${baseId}-trigger"]`,
          ),
        );

        const focused = document.activeElement as HTMLButtonElement;
        const currentIndex = triggers.indexOf(focused);
        if (currentIndex === -1) return;

        let nextIndex: number | null = null;

        switch (e.key) {
          case 'ArrowDown':
            e.preventDefault();
            nextIndex = (currentIndex + 1) % triggers.length;
            break;
          case 'ArrowUp':
            e.preventDefault();
            nextIndex = (currentIndex - 1 + triggers.length) % triggers.length;
            break;
          case 'Home':
            e.preventDefault();
            nextIndex = 0;
            break;
          case 'End':
            e.preventDefault();
            nextIndex = triggers.length - 1;
            break;
          default:
            break;
        }

        if (nextIndex !== null) {
          triggers[nextIndex].focus();
        }
      },
      [baseId],
    );

    const classes = [styles.accordion, className ?? '']
      .filter(Boolean)
      .join(' ');

    return (
      <div
        ref={ref}
        className={classes}
        onKeyDown={handleGroupKeyDown}
        {...rest}
      >
        {items.map((item) => {
          const triggerId = `${baseId}-trigger-${item.id}`;
          const panelId = `${baseId}-panel-${item.id}`;

          return (
            <AccordionItemComponent
              key={item.id}
              item={item}
              isOpen={openItems.has(item.id)}
              onToggle={toggleItem}
              triggerId={triggerId}
              panelId={panelId}
            />
          );
        })}
      </div>
    );
  },
);

Accordion.displayName = 'Accordion';

export default Accordion;
