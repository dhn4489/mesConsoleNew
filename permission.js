import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'
import { createRouter, createWebHistory } from 'vue-router'
NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login'] // no redirect whitelist

router.beforeEach(async(to, from, next) => {
  // start progress bar
  NProgress.start()

  // set page title
  document.title = getPageTitle(to.meta.title)

  // determine whether the user has logged in
  const hasToken = getToken()

  if (hasToken) {
   // console.log('有token')
    if (to.path === '/login') {
      // if is logged in, redirect to the home page
      next({ path: '/transit' })
      NProgress.done()
    } else {
      
      const hasGetUserInfo = store.getters.foreignid
      const hasrouter=store.getters.routesAdded
      //console.log('foreignid Access Routes:', hasrouter) // 检查生成的路由表
     // console.log('addRouters Access Routes:', hasrouter) // 检查生成的路由表
      if ((hasGetUserInfo && hasrouter && hasGetUserInfo === hasrouter) || !hasGetUserInfo) {
      
        next()
      //}
      } else 
      {
        try {
    
       const roles=store.getters.roles
          // 根据角色生成动态路由表
          const accessRoutes = await store.dispatch('permission/GenerateRoutes', roles)
         // console.log('Generated Access Routes:', accessRoutes) // 检查生成的路由表
          // 动态添加路由
          router.addRoutes(accessRoutes)
          //console.log('1111111111111111')
          //确保添加路由后再进行导航
          next({ ...to, replace: true })
        } catch (error) {
          console.log('error:',error)
          // remove token and go to login page to re-login
          await store.dispatch('user/resetToken')
          Message.error(error || 'Has Error')
          next(`/login?redirect=${to.path}`)
          NProgress.done()
        }
      }
    }
  } else {
    /* has no token*/
//console.log('1111111111111111')
    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next()
    } else {//console.log('1222222222222222222')
      // other pages that do not have permission to access are redirected to the login page.
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
//   if (to.path === '/transit') {
//     // 清除 Vuex 中的动态路由和用户信息
//          store.commit('user/RESET_CHIOCE')
//     console.log('reset alll')
//  console.log('after reset',store.getters.foreignid)
//   store.commit('permission/RESET_ROUTES')


//   // 创建新的路由实例

//   const newRouter = createRouter({
//     history: createWebHistory(),
//     routes: [] // 空路由表
//   })

//   // 重置路由器
//   router.matcher = newRouter.matcher // 重置路由表
//   console.log('Dynamic routes cleared successfully.')
//   }

})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
