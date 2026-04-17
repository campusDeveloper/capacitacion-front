export function currencyFormat(value, maximumFractionDigits = 0) {
	if (!value && typeof value !== 'number') return null;
	return new Intl.NumberFormat('es-CO', { minimumFractionDigits: 0, maximumFractionDigits }).format(value);
}