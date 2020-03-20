// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import { TextBox } from './JS/TextBox'
import { MDCChipSet } from '@material/chips';
import { Common } from './JS/Common'
import { Text } from './JS/Text'
import { BootstrapVue, BootstrapVueIcons } from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import 'bootstrap/dist/js/bootstrap.js'
import { MdChips, MdField, MdButton, MdDatepicker, MdDialog, MdEmptyState } from 'vue-material/dist/components'
import 'vue-material/dist/vue-material.min.css'
import 'vue-material/dist/theme/default.css'
import axios from 'axios'
import VueAxios from 'vue-axios'

//import "@material/chips/mdc-chips.scss";
//const chipSetEl = document.querySelector('.mdc-chip-set');import vue from vue
const chipSetEl = [].map.call(document.querySelectorAll('.mdc-chip-set'), function (el) {
  return new MDCChipSet(el);
});
Vue.use(BootstrapVue)
Vue.use(BootstrapVueIcons)
Vue.use(MdChips)
Vue.use(MdField)
Vue.use(MdButton)
Vue.use(MdDatepicker)
Vue.use(MdDialog)
Vue.use(MdEmptyState)
Vue.use(TextBox)
Vue.use(VueAxios, axios)

router.beforeEach((to, from, next) => {
  const isLogin = localStorage.getItem('token') == 'ImLogin';
  console.log(to.path)
  if ((isLogin && to.path != '/') || (!isLogin && to.path === '/')) {
    console.log('進入目標頁')
    next();
  }
  else if (isLogin && (to.path === '/' )) {
    next('/HOME');
  }
  else {
    if (to.path === '/LOGIN/Y')
    console.log('導向登入頁')
      sessionStorage.setItem('IsLogin', "Y");
    next('/');
  }
});
router.afterEach((to, from, next) => {
  window.scrollTo(0, 0);

});

Vue.mixin(TextBox);
Vue.mixin(Common);
Vue.mixin(Text);
Vue.prototype.GameAPI_URL = process.env.GameAPI_URL;
Vue.prototype.CoreAPI_URL = process.env.CoreAPI_URL;
Vue.prototype.JumpPath = process.env.JumpPath;
Vue.prototype.API = process.env.NODE_ENV === 'sw' ? '.json' : '',
  Vue.prototype.type = process.env.NODE_ENV === 'sw' ? 'GET' : 'POST';
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
}
)


