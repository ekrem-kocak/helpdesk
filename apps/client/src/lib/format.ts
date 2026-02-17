/**
 * Centralized date formatting for the client app.
 * Use a single locale/options so we can switch to i18n or user locale later.
 */
const DEFAULT_LOCALE = 'en-US';
const DEFAULT_DATE_OPTIONS: Intl.DateTimeFormatOptions = {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
};

export function formatDate(
  date: Date | string,
  options: Intl.DateTimeFormatOptions = DEFAULT_DATE_OPTIONS,
  locale: string = DEFAULT_LOCALE,
): string {
  return new Date(date).toLocaleDateString(locale, options);
}
