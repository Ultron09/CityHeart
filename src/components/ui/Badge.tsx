import React from 'react';
import styles from './Badge.module.css';

// ---- Types ----------------------------------------------------------------

export type BadgeVariant = 'default' | 'accent' | 'success' | 'warning';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Visual style variant */
  variant?: BadgeVariant;
  /** Shows a colored dot indicator before the label */
  withDot?: boolean;
  /** Optional icon element (any React node) */
  icon?: React.ReactNode;
}

// ---- Component ------------------------------------------------------------

/**
 * Badge — small inline label component with four semantic color variants.
 * Used to highlight status, categories, or key information.
 */
const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  (
    {
      variant = 'default',
      withDot = false,
      icon,
      className,
      children,
      ...rest
    },
    ref,
  ) => {
    const classes = [
      styles.badge,
      styles[variant],
      className ?? '',
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <span
        ref={ref}
        className={classes}
        {...rest}
      >
        {withDot && (
          <span
            className={styles.dot}
            aria-hidden="true"
          />
        )}

        {icon && (
          <span className={styles.icon} aria-hidden="true">
            {icon}
          </span>
        )}

        {children && <span>{children}</span>}
      </span>
    );
  },
);

Badge.displayName = 'Badge';

export default Badge;
