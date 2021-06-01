import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Global from '../global.js'

Vue.use(VueRouter)
Vue.directive({
  inserted: function (el, binding) {
    document.title = el.dataset.title
  }
})
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push (location) {
  return originalPush.call(this, location).catch(err => err)
}

const routes = [{
  path: '/',
  name: 'Home',
  component: Home
},
{
  path: '/room',
  name: 'Room',
  // route level code-splitting
  // this generates a separate chunk (about.[hash].js) for this route
  // which is lazy-loaded when the route is visited.
  component: () =>
    import(/* webpackChunkName: "about" */ '../views/Room.vue'),
  meta: {
    index: 1,
    title: '房间'
  }
},
{
  path: '/dot',
  name: 'Dot',
  // route level code-splitting
  // this generates a separate chunk (about.[hash].js) for this route
  // which is lazy-loaded when the route is visited.
  component: () =>
    import(/* webpackChunkName: "about" */ '../views/DotMusic.vue'),
  meta: {
    index: 2,
    title: '点歌'
  }
},
{
  path: '/upload',
  name: 'Upload',
  // route level code-splitting
  // this generates a separate chunk (about.[hash].js) for this route
  // which is lazy-loaded when the route is visited.
  component: () =>
    import(/* webpackChunkName: "about" */ '../views/Upload.vue'),
  meta: {
    index: 3,
    title: '上传歌曲'
  }
},
{
  path: '/login',
  name: 'Login',
  component: () =>
    import(/* webpackChunkName: "about" */ '../components/Login.vue'),
  meta: {
    index: 4,
    title: '登录'
  }
}
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  // window.__axiosPromiseArr.forEach((ele, index) => {
  //   ele.cancel()
  //   delete window.__axiosPromiseArr[index]
  // })
  if (to.path !== '/' && !localStorage.getItem('userInfo')) {
    Global.isShow = true
    next('/')
  } else { next() }
})

export default router
