import { randomInt } from 'crypto'

export function generateCleanOTP(length = 6): string {
	// for UX, we'll remove confusing characters and only use uppercase characters
	// Removes: O (letter), 0 (zero), I (uppercase i), 1 (one), L
	const chars = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789'
	return Array.from({ length }, () => chars[randomInt(0, chars.length)]).join(
		'',
	)
}
