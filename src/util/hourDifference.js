import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';

dayjs.extend(duration);

/**
 * Calculates the difference between a given date and date
 * @param {string|Date|dayjs.Dayjs} hour1 - The hour/time to compare against
 * @param {string|Date|dayjs.Dayjs} hour2 - The hour/time to be compared
 * @returns {object} Object with the time difference containing days, hours, minutes, and seconds
 * @example
 * const diff = hourDifference('14:30', '16:45:30');
 * // Returns: { days: 0, hours: 2, minutes: 15, seconds: 30, total: '2h 15m 30s' }
 */
export function dateDifference(hour1, hour2) {
	if (!hour1 || !hour2) return null;

	const compare = dayjs(hour1);
	const compared = dayjs(hour2);
	
	if (!compare.isValid()) return null;
	if (!compared.isValid()) return null;

	const diff = dayjs.duration(compare.diff(compared));

	return {
		years: diff.years(),
		months: diff.months(),
		weeks: diff.weeks(),
		days: diff.days(),
		hours: diff.hours(),
		minutes: diff.minutes(),
		seconds: diff.seconds(),
		total: diff.format('D[d] H[h] m[m] s[s]').replace(/^0d /, '').trim()
	};
}

/**
 * Get the difference in hours (decimal format)
 * @param {string|Date|dayjs.Dayjs} hour1 - The hour/time to compare against
 * @param {string|Date|dayjs.Dayjs} hour2 - The hour/time to be compared
 * @returns {number} Difference in hours
 */
export function dateDifferenceInHours(hour1, hour2) {
	if (!hour1 || !hour2) return null;

	const compare = dayjs(hour2);
	const compared = dayjs(hour1);
	
	if (!compare.isValid()) return null;
	if (!compared.isValid()) return null;

	return compare.diff(compared, 'hours', true).toFixed(1);
}

/**
 * Get the difference in minutes
 * @param {string|Date|dayjs.Dayjs} hour1 - The hour/time to compare against
 * @param {string|Date|dayjs.Dayjs} hour2 - The hour/time to be compared
 * @returns {number} Difference in minutes
 */
export function hourDifferenceInMinutes(hour1, hour2) {
	if (!hour1 || !hour2) return null;

	const compare = dayjs(hour1);
	const compared = dayjs(hour2);
	
	if (!compare.isValid()) return null;
	if (!compared.isValid()) return null;

	return compare.diff(compared, 'minutes');
}
