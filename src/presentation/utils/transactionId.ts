/**
 * Obscures all but the last four characters of a transaction id, the way a statement
 * would print a card number.
 *
 * @param {string} id - The full transaction id.
 * @returns {string} The masked id, for example `•••• 4821`.
 */
export const maskTransactionId = (id: string): string => `•••• ${id.slice(-4)}`;
