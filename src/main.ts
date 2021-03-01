import { createApp } from 'vue';
import PrimeVue from 'primevue/config';
import App from './App.vue';
import { store } from './store';
import 'primevue/resources/themes/md-light-indigo/theme.css';
import 'primevue/resources/primevue.min.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';
import './assets/css/style.css';

createApp(App).use(store).use(PrimeVue).mount('#app');
