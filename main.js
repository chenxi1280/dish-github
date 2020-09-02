import Vue from 'vue';
import App from './App';
import uView from "uview-ui";
// import waterfall from './components/wfalls-flow/wfalls-flow.vue'  
// Vue.component('waterfall',waterfall)  
Vue.use(uView);

Vue.config.productionTip = false
App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()
