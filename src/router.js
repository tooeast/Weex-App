/*global Vue*/
import Router from 'vue-router'

import welcome from '@/views/welcome'
import login from '@/views/login'
import register from '@/views/register'
import meet from '@/views/meet'

import home from '@/views/home'
import friend from '@/views/friend'
import search from '@/views/search'
import mine from '@/views/mine'
import update from '@/views/update'

Vue.use(Router)

module.exports = new Router({
  routes: [
    {
      path: '/',
      name: 'welcome',
      component: welcome
    },
    {
      path: '/login',
      name: 'login',
      component: login
    },
    {
      path: '/register',
      name: 'register',
      component: register
    },
    {
      path: '/left',
      name: 'left',
      component: home
    },
    {
      path: '/center',
      name: 'center',
      component: friend
    },
    {
      path: '/right',
      name: 'right',
      component: mine
    },
    {
      path: '/update',
      name: 'update',
      component: update
    },
    {
      path: '/meet',
      name: 'meet',
      component: meet
    },
    {
      path: '/search',
      name: 'search',
      component: search
    }
  ]
})
