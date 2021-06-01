import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './assets/fonts/iconfont.css'
import Axios from 'axios'
import Global from './global.js'
import { Input,Row, Slider, Dropdown, DropdownMenu, DropdownItem, Image, Dialog, Upload, Button } from 'element-ui'

// import { action, state } from './gl'
// Vue.prototype.$action = action;
// vue.prototype.$state = state;
Vue.use(Row)
Vue.use(Input)
Vue.use(Image)
Vue.use(Slider)
Vue.use(Dialog)
Vue.use(Upload)
Vue.use(Button)
Vue.use(Dropdown)
Vue.use(DropdownMenu)
Vue.use(DropdownItem)
Vue.config.productionTip = false

Vue.prototype.$global = Global
Vue.prototype.$http = Axios

new Vue({
    router,
    store,
    render: (h) => h(App)
}).$mount('#app')