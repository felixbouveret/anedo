import 'element-plus/dist/index.css';
import './styles/_main.scss';

import ElementPlus from 'element-plus';
import { createApp } from 'vue';

import Auth from './api/Auth';
import App from './App.vue';
import { useUser } from './composables/useUser';
import i18n from './i18n';
import router from './router';

const { fillUserData } = useUser();

Auth.authState((user) => {
  if (user) fillUserData(user);
});

const app = createApp(App);
app.use(router);
app.use(ElementPlus);
app.use(i18n);
app.mount('#app');
