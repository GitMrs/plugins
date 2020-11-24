import Vue from 'vue';
import App from './app';
import VueI18n from 'vue-i18n';
import i18n from './lang/index';
import store from './store';
Vue.use(VueI18n, {
  i18n: (key, value) => i18n.t(key, value)
});
export default new Vue({
  el: "#app",
  i18n,
  store,
  render: h => h(App)
})