import { useEffect, useState } from "react";

/**
 * Trails `value` by `delay` milliseconds, and hands back a setter that skips the wait.
 *
 * The setter exists for the search field's clear button: setting the source value and the
 * debounced one in the same batch reschedules the pending timer, so a keystroke that was
 * already in flight can no longer land after the field was cleared.
 *
 * @param {T} value - The value to trail.
 * @param {number} delay - How long to wait after the last change, in milliseconds.
 * @returns {[T, (next: T) => void]} The debounced value, and a setter that applies at once.
 */
export const useDebouncedValue = <T>(
	value: T,
	delay: number,
): [T, (next: T) => void] => {
	const [debounced, setDebounced] = useState(value);

	useEffect(() => {
		const timer = setTimeout(() => setDebounced(value), delay);
		return () => clearTimeout(timer);
	}, [value, delay]);

	return [debounced, setDebounced];
};
