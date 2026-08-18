const usd = new Intl.NumberFormat("en-US", {
	style: "currency",
	currency: "USD",
});

/**
 * Formats a magnitude without a sign, for totals where the label already carries the
 * meaning.
 *
 * @param {number} amount - The amount, signed or not.
 * @returns {string} The absolute amount, for example `$1,840.00`.
 */
export const formatCurrency = (amount: number): string =>
	usd.format(Math.abs(amount));

/**
 * Formats an amount with an explicit sign, using U+2212 rather than a hyphen so the
 * minus aligns with the digits in a column.
 *
 * @param {number} amount - Positive for income, negative for an expense.
 * @returns {string} The signed amount, for example `+$1,840.00` or `−$54.18`.
 */
export const formatSignedCurrency = (amount: number): string =>
	`${amount < 0 ? "−" : "+"}${usd.format(Math.abs(amount))}`;
