export const formatCurrencyCOP = (value) => {
	if (!value && typeof value !== 'number') return null;
	return new Intl.NumberFormat('es-CO', {
		style: 'currency',
		currency: 'COP',
		minimumFractionDigits: 0,
		maximumFractionDigits: 0
	}).format(value);
};

export const formatNumber = (value) => {
	if (!value && typeof value !== 'number') return null;
	return new Intl.NumberFormat('es-CO', {
		maximumFractionDigits: 0
	}).format(value);
};
