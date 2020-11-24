import Vue from 'vue';
import Vuex from 'vuex';
import Cookies from 'js-cookie';
import { getLanguage } from './lang/index';
Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    language: getLanguage(),
  },
  mutations: {
    SET_LANGUAGE: (state, language) => {
      state.language = language;
      Cookies.set('language', language)
    }
  },
  actions: {
    setLanguage({ commot }, language) {
      commot('SET_LANGUAGE', language)
    }
  }
})