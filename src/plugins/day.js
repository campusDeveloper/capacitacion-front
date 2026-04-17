import app from '../app';
import dayjs from 'dayjs';
import 'dayjs/locale/es';

import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

app.config.globalProperties.$dayjs = dayjs;

