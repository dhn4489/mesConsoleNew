// store/permission.js
import { asyncRouterMap, constantRoutes } from '@/router/index'
import store from '@/store';
function hasPermission(roles, route) {
  if (route.meta && route.meta.role) {
    return roles.some(role => route.meta.role.indexOf(role) >= 0)
  } else {
    return true
  }
}

const permission = {
  namespaced: true, // 开启命名空间
  state: {
    routers: constantRoutes,
    addRouters: [],
    routesAdded:''
  },
  mutations: {
    SET_ROUTERS: (state, routers) => {
      state.addRouters = routers
      state.routers = constantRoutes.concat(routers)
    },
    SET_ROUTERSADDED:(state,routersadded)=>{
      state.routesAdded=routersadded
    },
    RESET_ROUTES: (state) => {
      // 重置动态路由，重新设置为初始路由
      state.addRouters = []
      state.routes = constantRoutes  // 重新设置为初始路由表

      // 创建新的空路由实例
      const newRouter = createRouter({
        history: createWebHistory(),
        routes: []  // 空路由表
      })

      // 重新设置 Vue Router 的 matcher
      router.matcher = newRouter.matcher  // 重置路由表
      console.log('Dynamic routes cleared successfully.')
    
    }
  },
  actions: {
    GenerateRoutes({ commit }, data) {
      //console.log('Received data for GenerateRoutes:', data) // 打印传入的 data，确保其中包含 roles
      // if (Array.isArray(data)) {
      //   console.log('Roles from array:', data);  // 输出 roles 数组
      // } else {
      //   console.error('Error: Expected data to be an array');
      // }

      return new Promise(resolve => {
        // const { roles } = data
        const roles = data // 将 data 直接重命名为 roles
      //  console.log('Roles:', roles) // 输出传入的角色数据

        const accessedRouters = asyncRouterMap.filter(v => {
       //   console.log('Checking route:', v) // 打印每个路由项
          // if (roles.indexOf('admin') >= 0) return true
          if (hasPermission(roles, v)) {
            if (v.children && v.children.length > 0) {
              v.children = v.children.filter(child => {
                if (hasPermission(roles, child)) {
                  return child
                }
                return false
              })
              return v
            } else {
              return v
            }
          }
          return false
        })
       // console.log('生成的访问路由:', accessedRouters)
        const res=store.getters.foreignid
        commit('SET_ROUTERSADDED',res)
        commit('SET_ROUTERS', accessedRouters)
        resolve(accessedRouters)
      })
    }
  }
}

export default permission

