const time = new Intl.DateTimeFormat("en-US", {
	hour: "numeric",
	minute: "2-digit",
});

const shortDate = new Intl.DateTimeFormat("en-US", {
	month: "short",
	day: "numeric",
});

const longDate = new Intl.DateTimeFormat("en-US", {
	weekday: "long",
	year: "numeric",
	month: "long",
	day: "numeric",
});

const DAY_MS = 86_400_000;

/**
 * Whether two dates fall on the same calendar day, in the device's timezone.
 *
 * @param {Date} a - First date.
 * @param {Date} b - Second date.
 * @returns {boolean} `true` when both land on the same day.
 */
export const isSameDay = (a: Date, b: Date): boolean =>
	a.getFullYear() === b.getFullYear() &&
	a.getMonth() === b.getMonth() &&
	a.getDate() === b.getDate();

/**
 * Formats the time of day shown on a transaction row.
 *
 * @param {Date} date - The transaction's date.
 * @returns {string} The local time, for example `8:42 AM`.
 */
export const formatTime = (date: Date): string => time.format(date);

/**
 * Builds the sticky section header for a day group.
 *
 * @param {Date} date - The day being labelled.
 * @param {Date} now - The reference time "today" is measured against.
 * @returns {string} `TODAY`, `YESTERDAY`, or a short date such as `AUG 12`.
 */
export const formatDayLabel = (date: Date, now: Date): string => {
	if (isSameDay(date, now)) return "TODAY";
	if (isSameDay(date, new Date(now.getTime() - DAY_MS))) return "YESTERDAY";
	return shortDate.format(date).toUpperCase();
};

/**
 * Formats the full date shown in the transaction detail sheet.
 *
 * @param {Date} date - The transaction's date.
 * @returns {string} For example `Monday, August 17, 2026 · 6:30 AM`.
 */
export const formatFullDate = (date: Date): string =>
	`${longDate.format(date)} · ${time.format(date)}`;

/**
 * Builds a stable key identifying the calendar day a date belongs to, used to group
 * transactions.
 *
 * @param {Date} date - The date to key.
 * @returns {string} A key unique to that calendar day.
 */
export const toDayKey = (date: Date): string =>
	`${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
