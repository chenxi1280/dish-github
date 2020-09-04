import Vue from 'vue';
import App from './App';
import uView from "uview-ui";
import {RouterMount} from 'uni-simple-router';
import Router from './router'
Vue.use(Router)
Vue.use(uView);

Vue.config.productionTip = false
App.mpType = 'app'


const app = new Vue({
    ...App
})

RouterMount(app,'#app');

app.$mount()
