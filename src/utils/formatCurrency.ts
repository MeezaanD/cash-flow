import { CurrencyCode } from '../types';

export const formatCurrency = (amount: number | string, currency: CurrencyCode = 'ZAR') => {
	// Handle invalid inputs
	if (isNaN(Number(amount)) || !isFinite(Number(amount))) {
		return 'R0.00';
	}

	let numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;

	// Handle negative zero by converting to positive zero
	if (Object.is(numAmount, -0)) {
		numAmount = 0;
	}

	// Choose locale heuristically by currency for better formatting defaults
	const localeByCurrency: Record<CurrencyCode, string> = {
		ZAR: 'en-ZA',
		USD: 'en-US',
		EUR: 'de-DE',
		GBP: 'en-GB',
		JPY: 'ja-JP',
		AUD: 'en-AU',
		CAD: 'en-CA',
	};
	const locale = localeByCurrency[currency] || 'en-ZA';

	return numAmount.toLocaleString(locale, {
		style: 'currency',
		currency,
		minimumFractionDigits: 2,
		maximumFractionDigits: 2,
	});
};
