declare namespace NodeJS {
  interface ProcessEnv {
    NEXT_PUBLIC_ANALYTICS_ENABLED?: string;
    TRIPADVISOR_API_KEY?: string;
    EMAIL_API_KEY?: string;
    EMAIL_FROM?: string;
    EMAIL_TO?: string;
    NEXT_PUBLIC_SENTRY_DSN?: string;
  }
}
