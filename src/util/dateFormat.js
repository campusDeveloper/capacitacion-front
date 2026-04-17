import dayjs from 'dayjs';
import 'dayjs/locale/es';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

export function DateFormat(date, format) {
	if(!date) return ''
	if(format === 'LT'){
		return dayjs.tz('2023-01-01'+ date).locale('es').format("hh:mm A");
	}
	return dayjs(date ?? Date()).locale('es').format(format);
}
export function setDateInHour(hora) {
	if(!hora) return ''
	return dayjs.tz('2023-01-01'+ hora).locale('es');
}