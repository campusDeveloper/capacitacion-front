export function DateFormatHuman(date) {
	const d = new Date(date)
	const now = new Date()

	const diffSeconds = Math.floor((now - d) / 1000)
	const diffMinutes = Math.floor(diffSeconds / 60)
	const diffHours = Math.floor(diffMinutes / 60)
	const diffDays = Math.floor(diffHours / 24)

	const rtf = new Intl.RelativeTimeFormat('es-CO', { numeric: 'auto' })

	if (diffSeconds < 60) {
		return diffSeconds < 10 ? 'ahora' : rtf.format(-diffSeconds, 'second')
	}

	if (diffMinutes < 60) {
		return rtf.format(-diffMinutes, 'minute')
	}

	if (diffHours < 24) {
		return rtf.format(-diffHours, 'hour')
	}

	if (diffDays < 7) {
		return rtf.format(-diffDays, 'day')
	}

	return d.toLocaleDateString('es-CO', {
		day: '2-digit',
		month: 'short',
		year: 'numeric'
	}).replace('.', '')
}
