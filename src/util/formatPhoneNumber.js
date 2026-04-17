import { parsePhoneNumberFromString } from 'libphonenumber-js'

/**
 * Formateador general de números telefónicos
 * @param phone - El string o número a formatear
 * @param defaultCountry - País por defecto si el número no tiene código (ej. 'CO')
 * @returns String formateado en E.164 (ej. +573001234567)
 */
export const formatPhoneGeneral = (phone, defaultCountry = 'CO') => {
	if (!phone) return ''

	const phoneStr = phone.toString().trim()

	const phoneNumber = parsePhoneNumberFromString(phoneStr, defaultCountry)

	if (!phoneNumber) {
		return phoneStr.replace(/\D/g, '')
	}

	if (phoneNumber.isValid()) {
		return phoneNumber.format('E.164')
	}

	return phoneNumber.number
}

export const usePhoneFormatter = () => {
	return {
		formatPhone: (phone) => formatPhoneGeneral(phone, 'CO')
	}
}
