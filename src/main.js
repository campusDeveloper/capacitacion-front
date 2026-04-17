import app from './app';
import router from './shared/router';
import './util/customComponents.js';
import './plugins';

app.use(router);
app.mount('#app');
