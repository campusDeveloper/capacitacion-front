import { localize } from '@vee-validate/i18n';
import es from '@vee-validate/i18n/dist/locale/es.json';

import { defineRule, configure } from 'vee-validate';
import { all } from '@vee-validate/rules';

Object.entries(all).forEach(([name, rule]) => {
	defineRule(name, rule);
});

localize({ es });

configure({
	generateMessage: localize('es'),
});