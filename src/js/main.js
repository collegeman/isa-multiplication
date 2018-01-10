import Vue from 'vue'
import VueRouter from 'vue-router'
import routes from './routes'
import 'bootstrap'

Vue.use(VueRouter)

const router = new VueRouter({
  mode: 'hash',
  linkActiveClass: 'open active',
  routes
})

router.afterEach((to, from) => {
  //
})

router.beforeEach((to, from, next) => {
  return next()
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<router-view></router-view>'
})
