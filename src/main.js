import babelpolyfill from 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import ElementUI from 'element-ui'
import Moment from 'moment'

Vue.prototype.moment = Moment
// 1.全局css样式
import 'element-ui/lib/theme-chalk/index.css'
//import './asset/theme/theme-green/index.css'

// 2.导入vue-router
import VueRouter from 'vue-router'

// 3.导入vuex实例化对象store用来处理不同组件之间的传值
import store from './vuex/store'
import Vuex from 'vuex'
//import NProgress from 'nprogress'
//import 'nprogress/nprogress.css'

// 4.导入vue-router实例化对象routes，处理所有路由
import routes from './routes'

// 5.使用mock来模拟后台数据，其实就是一个测试的数据模块
// import Mock from './mock'
// Mock.bootstrap();
import 'font-awesome/css/font-awesome.min.css'

// 6.加载各个组件
Vue.use(ElementUI)
Vue.use(VueRouter)
Vue.use(Vuex)

//NProgress.configure({ showSpinner: false });

const router = new VueRouter({
  mode:"history",
  routes
})

// 7.路由前钩子，所有request必须在用户登录的情况才能访问
router.beforeEach((to, from, next) => {
  //NProgress.start();
  if (to.path == '/login') {
    sessionStorage.removeItem('user');
  }
  let user = JSON.parse(sessionStorage.getItem('user'));
  if (!user && to.path != '/login') {
    next({ path: '/login' })
  } else {
    //刷新页面的情况，刷新后用户的权限都没了，这里是重新获取permissionRoutes
    if(! store.permissionRoutes && user) {
      store.dispatch('generateRoutes', {
        router: router.options.routes,
        role: user.role
      })
    }
    next()
  }
})

//router.afterEach(transition => {
//NProgress.done();
//});

// 8.声明全局Vue对象实例，并且挂载路由，存储，最后渲染到App上
/*
  Vue注意的重要特性
   1. import 一个模块的时候，另外一个模块必须export
   2. {} 这个代表是一个对象，可以理解为字典或者hash类型的对象，很重要的数据类型，当key和value一致的时候可以省略value，比如：
      {
        UserList:UserList,
        Users:Users,
      }
      等价于
      {
        UserList,
        Users,
      }
*/
new Vue({
  //el: '#app',
  //template: '<App/>',
  router,
  store,
  //components: { App }
  render: h => h(App)
}).$mount('#app')

