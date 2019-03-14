// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import VueRouter from 'vue-router';
import Goods from '@/components/goods/Goods';
import Ratings from '@/components/ratings/Ratings';
import Seller from '@/components/seller/Seller';

Vue.config.productionTip = false

Vue.use(VueRouter)

const routes = [
  {path:"/",redirect:"/goods"},
  {path:"/goods",component:Goods},
  {path:"/ratings",component:Ratings},
  {path:"/seller",component:Seller}
]

// 实例化router
const router = new VueRouter({
  routes,
  linkActiveClass:"active" //配置 <router-link> 的默认“激活 class 类名”，默认值: "router-link-active"。（每次点击路由标签时，会自动在标签上添加类名）
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
