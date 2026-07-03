import React from 'react';
import styles from './Button.module.css';

// ---- Types ----------------------------------------------------------------

export type ButtonVariant = 'primary' | 'secondary' | 'ghost';
export type ButtonSize = 'default' | 'large';

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual style variant */
  variant?: ButtonVariant;
  /** Size preset */
  size?: ButtonSize;
  /** Stretch to fill container width */
  fullWidth?: boolean;
  /** Shows a loading spinner and disables interaction */
  loading?: boolean;
  /** Optional leading icon (any React node) */
  iconLeft?: React.ReactNode;
  /** Optional trailing icon (any React node) */
  iconRight?: React.ReactNode;
}

// ---- Component ------------------------------------------------------------

/**
 * Button — primary interactive control with three visual variants and two
 * size presets. Enforces a minimum 44×44 px touch target for mobile
 * accessibility (WCAG 2.5.5).
 */
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'default',
      fullWidth = false,
      loading = false,
      iconLeft,
      iconRight,
      disabled,
      className,
      children,
      ...rest
    },
    ref,
  ) => {
    const isDisabled = disabled || loading;

    const classes = [
      styles.button,
      styles[variant],
      styles[size],
      fullWidth ? styles.fullWidth : '',
      loading ? styles.loading : '',
      className ?? '',
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <button
        ref={ref}
        className={classes}
        disabled={isDisabled}
        aria-disabled={isDisabled || undefined}
        aria-busy={loading || undefined}
        {...rest}
      >
        {loading && (
          <span
            className={styles.spinner}
            aria-hidden="true"
          />
        )}

        {!loading && iconLeft && (
          <span aria-hidden="true">{iconLeft}</span>
        )}

        {children && <span>{children}</span>}

        {!loading && iconRight && (
          <span aria-hidden="true">{iconRight}</span>
        )}
      </button>
    );
  },
);

Button.displayName = 'Button';

export default Button;
