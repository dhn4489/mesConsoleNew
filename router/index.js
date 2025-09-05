import Vue from 'vue'
import Router from 'vue-router'
/* eslint-disable */
import Login from '../views/login/';
const dashboard = resolve => require(['../views/dashboard/index'], resolve);
Vue.use(Router)
import Permission from '@/views/permission/index.vue';
/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */

 
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },
  
  {
    path: '/',
    component: Layout,
    redirect: '/transit',
    children: [{
    path: '/transit',
    name: 'transit',
    component: () => import('@/views/beforelogin/index'),
    //hidden: true
  },]
  },



  // 404 page must be placed at the end !!!
//  { path: '*', redirect: '/404', hidden: true }
]
// //实例化vue的时候只挂载constantRouter
// export default new Router({
//   routes: constantRouterMap
// });
export const asyncRouterMap = [
  
  {
    path: '/dashboard',
    component: Layout,
    redirect: '/dashboardview',
       name:'dashboard', 
        meta: { title: 'Dashboard', icon: 'el-icon-s-home'},
        children:[{
          path: '/dashboardview',
    component:  () => import('@/views/dashboard'),
    name: 'Dashboardview', 
    meta: {
      title: 'Dashboard', 
      icon: 'el-icon-s-home',
    //  role: ['admin', 'ProjectOverviewPage'],
      breadcrumb: true  // 显示在面包屑中
    }
  },
        ]
  },
  //查看项目信息
   {
    path: '/project',
    component: Layout,
    redirect: '/projectoverview',
       name:'项目信息', 
        meta: { title: '项目信息', icon: 'dashboard',role: ['admin', 'ProjectOverviewPage'],},
        children:[{
          path: '/projectoverview',
            component:  () => import('@/views/project/projectOverview'),
            name: '总视图', 
            meta: {
              title: '总视图', 
              icon: 'dashboard',
              role: ['admin', 'ProjectOverviewPage'],
             // breadcrumb: true  // 显示在面包屑中
            }
        }]
  },
  //角色管理
  {
    path: '/role',
    component: Layout,
    redirect: '/roleview',
       name:'角色管理', 
        meta: { title: '角色管理', icon: 'el-icon-user-solid',role: ['admin', 'RoleSettingsPage',
          "ProcessRoleSettingsPage",'BussinessRolePage','LogisticsRolesettingsPage','LogisticsStorehousePage','FundRolePage'],},
        children:[{
          path: '/roleview',
            component:  () => import('@/views/roles'),
            name: '角色管理页', 
            meta: {
              title: '角色管理页', 
              icon: 'el-icon-user-solid',
              role: ['admin', 'RoleSettingsPage',
                "ProcessRoleSettingsPage",'BussinessRolePage','LogisticsRolesettingsPage','LogisticsStorehousePage','FundRolePage'],
             // breadcrumb: true  // 显示在面包屑中
            }
        }]
  },
  //成员管理
  {
    path: '/PersonnelManagement',
    component: Layout,
    redirect: '/PersonnelManagementview',
       name:'成员管理', 
        meta: { title: '成员管理', icon: 'el-icon-user-solid',role: ['admin', 'PersonnelManagementPage','ProcessPersonnelManagementPage','BussinessRolePage', 'LogisticsStorehousePage','FundMemberPage'],},
        children:[{
          path: '/PersonnelManagementview',
            component:  () => import('@/views/PersonnelManagement'),
            name: '成员管理页', 
            meta: {
              title: '成员管理页', 
              icon: 'el-icon-s-custom',
              role: ['admin', 'PersonnelManagementPage','ProcessPersonnelManagementPage','BussinessRolePage','LogisticsStorehousePage','FundMemberPage'],
             // breadcrumb: true  // 显示在面包屑中
            }
        }]
  },
  //任务管理
  {
    path: '/task',
    component: Layout,
    //redirect: '/task/task-decomposition',
    alwaysShow: true,
    name: '任务管理',
    meta: {
      title: '任务管理',  // 显示在侧边栏中的名称
      icon: 'el-icon-s-order',  // 显示在侧边栏中的图标
      role: ['admin','ProjectOverviewPage',"TaskDetailPage",
        "ProcessTaskDetailPage","ProcessTaskDataPage"]  // 页面需要的权限
    },
    children: [
      {
        path: 'task-decomposition',
        component: () => import('@/views/Task/Task Decomposition'),
        name: '任务分解',
        meta: {
          title: '任务分解',
          role: ['admin',"TaskDecompositionPage","ProcessTaskDetailPage"]  // 页面需要的权限
        }
      },
      {
        path: 'task-details',
        component: () => import('@/views/Task/Task Details'),
        name: '任务详细',
        meta: {
          title: '任务详细',
          role: ['admin',"TaskDetailPage"]  // 页面需要的权限
        }
      },
      {
        path: 'task-data',
        component: () => import('@/views/Task/TaskDataPage'),
        name: '任务数据',
        meta: {
          title: '任务数据',
          role: ['admin',
            "ProcessTaskDataPage"]  // 页面需要的权限
        }
      }
    ]
  },
  //下级组创建
    //任务管理
    {
      path: '/SubordinateGroupCreat',
      component: Layout,
      //redirect: '/task/task-decomposition',
      alwaysShow: true,
      name: '下级组创建',
      meta: {
        title: '下级组创建',  // 显示在侧边栏中的名称
        icon: 'el-icon-s-order',  // 显示在侧边栏中的图标
        role: ['admin','SubordinateGroupCreatePage',
          "ProcessSubordinateGroupCreatePage"]  // 页面需要的权限
      },
      children: [
        {
          path: 'SubordinateGroupCreat',
          component: () => import('@/views/subordinate/SubordinateGroupCreat'),
          name: '下级组创建页',
          meta: {
            title: '下级组创建页',
            role: ['admin','SubordinateGroupCreatePage'
            ]  // 页面需要的权限
          }
        },
        {
          path: 'SubordinateProcessGroup',
          component: () => import('@/views/subordinate/Subordinate Process Group'),
          name: '下级工艺组',
          meta: {
            title: '下级工艺组',
            role: ['admin',
              "ProcessSubordinateGroupCreatePage"]  // 页面需要的权限
          }
        },
      ]
    },
  //数据管理
  // {
  //   path: '/data',
  //   component: Layout,
  //  // redirect: '/data/initiate-request',
  //   alwaysShow: true,
  //   name: '数据管理',
  //   meta: {
  //     title: '数据管理',  // 显示在侧边栏中的名称
  //     icon: 'el-icon-s-platform',  // 显示在侧边栏中的图标
  //     role: ['admin',"DataRequestPage","DataDetailPage","DataAnalysisPage"]  // 页面需要的权限
  //   },
  //   children: [
  //     {
  //       path: 'initiate-request',
  //       component: () => import('@/views/Data/Initiate Data Request'),
  //       name: '发起数据申请',
  //       meta: {
  //         title: '发起数据申请',
  //         role: ['admin',"DataRequestPage"]  // 页面需要的权限
  //       }
  //     },
  //     {
  //       path: 'data-details',
  //       component: () => import('@/views/Data/Data Details'),
  //       name: '数据详细',
  //       meta: {
  //         title: '数据详细',
  //         role: ['admin',"DataDetailPage"]  // 页面需要的权限
  //       }
  //     },
  //     {
  //       path: 'data-analysis',
  //       component: () => import('@/views/Data/Data Analysis'),
  //       name: '数据分析',
  //       meta: {
  //         title: '数据分析',
  //         role: ['admin',"DataAnalysisPage"]  // 页面需要的权限
  //       }
  //     }
  //   ]
  // },
  //物料管理
  // {
  //   path: '/material',
  //   component: Layout,
  //  // redirect: '/material/material-request',
  //   alwaysShow: true,
  //   name: '物料管理',
  //   meta: {
  //     title: '物料管理',  // 显示在侧边栏中的名称
  //     icon: 'el-icon-goods',  // 显示在侧边栏中的图标
  //     role: ['admin',"MaterialRequestPage","MaterialMovementPage"]  // 页面需要的权限
  //   },
  //   children: [
  //     {
  //       path: 'material-request',
  //       component: () => import('@/views/material/Material Request'),
  //       name: '物料申请',
  //       meta: {
  //         title: '物料申请',
  //         role: ['admin',"MaterialRequestPage"]  // 页面需要的权限
  //       }
  //     },
  //     {
  //       path: 'material-operation-status',
  //       component: () => import('@/views/material/Material Operation Status'),
  //       name: '物料运转情况',
  //       meta: {
  //         title: '物料运转情况',
  //         role: ['admin',"MaterialMovementPage"]  // 页面需要的权限
  //       }
  //     }
  //   ]
  // },
  //设备管理
  {
    path: '/equipment-management',
    component: Layout,
    //redirect: '/equipment-management/equipment-information',
    alwaysShow: true,
    name: '设备管理',
    meta: {
      title: '设备管理',  // 显示在侧边栏中的名称
      icon: 'el-icon-s-tools',  // 显示在侧边栏中的图标
      role: ['admin','ProcessEquipmentPage','ProcessMaintenancePage']  // 页面需要的权限
    },
    children: [
      {
        path: 'equipment-information',
        component: () => import('@/views/Equipment Management/Equipment Information'),
        name: '设备信息',
        meta: {
          title: '设备信息',
          role: ['admin','ProcessEquipmentPage']  // 页面需要的权限
        }
      },
      {
        path: 'equipment-repair-request',
        component: () => import('@/views/Equipment Management/Equipment Repair Request'),
        name: '设备维修申请',
        meta: {
          title: '设备维修申请',
          role: ['admin','ProcessMaintenancePage']  // 页面需要的权限
        }
      },
      // {
      //   path: 'equipment-usage-management',
      //   component: () => import('@/views/Equipment Management/Equipment Usage Management'),
      //   name: '设备使用管理',
      //   meta: {
      //     title: '设备使用管理',
      //     role: ['admin']  // 页面需要的权限
      //   }
      // }
    ]
  },
  // //人员管理
  // {
  //   path: '/role-configuration',
  //   component: Layout,
  //   //redirect: '/personnel-configuration/role-settings',
  //   alwaysShow: true,
  //   name: '人员配置',
  //   meta: {
  //     title: '人员配置',  // 显示在侧边栏中的名称
  //     icon: 'el-icon-user',  // 显示在侧边栏中的图标
  //     role: ['admin']  // 页面需要的权限
  //   },
  //   children: [
  //     {
  //       path: 'role-settings',
  //       component: () => import('@/views/personnel configuration/Role Settings'),
  //       name: '角色设置',
  //       meta: {
  //         title: '角色设置',
  //         role: ['admin']  // 页面需要的权限
  //       }
  //     },
  //     {
  //       path: 'role-management',
  //       component: () => import('@/views/personnel configuration/Personnel Management'),
  //       name: '人员管理',
  //       meta: {
  //         title: '人员管理',
  //         role: ['admin']  // 页面需要的权限
  //       }
  //     }
  //   ]
  // },
  //资金申请
  {
    path: '/funding-application',
    component: Layout,
    //redirect: '/funding-application/request',
    name: '资金申请',
    meta: {
      title: '资金申请',  // 显示在侧边栏中的名称
      icon: 'el-icon-money',  // 显示在侧边栏中的图标
      role: ['admin','FundRequestPage','ProcessFundRequestPage','BussineessFundRequestPage']  // 页面需要的权限
    },
    children: [
      {
        path: 'FundRequest',
        component: () => import('@/views/FundRequest'),
        name: '资金申请详情',
        meta: {
          title: '资金申请详情',
          role: ['admin','FundRequestPage','ProcessFundRequestPage','BussineessFundRequestPage']  // 页面需要的权限
        }
      }
    ]
  },
  {
    path: '/BussinessProject',
    component: Layout,
    //redirect: '/funding-application/request',
    redirect: '/BussinessProjectpage',
    name: '创建项目',
    meta: {
      title: '创建项目',  // 显示在侧边栏中的名称
      icon: 'el-icon-folder-add',  // 显示在侧边栏中的图标
      role: ['admin','BussinessProjectPage']  // 页面需要的权限
    },
    children: [
      {
        path: '/BussinessProjectpage',
        component: () => import('@/views/BussinessProject'),
        name: '创建项目页',
        meta: {
          title: '创建项目页',
          role: ['admin','BussinessProjectPage']  // 页面需要的权限
        }
      }
    ]
  },
  {
    path: '/transportrequest',
    component: Layout,
    //redirect: '/funding-application/request',
    redirect: '/transportrequestpage',
    name: '运输申请',
    meta: {
      title: '运输申请',  // 显示在侧边栏中的名称
      icon: 'el-icon-truck',  // 显示在侧边栏中的图标
      role: ['admin','ProcessTransportCreatePage']  // 页面需要的权限
    },
    children: [
      {
        path: '/transportrequestpage',
        component: () => import('@/views/transportrequest'),
        name: '运输申请页',
        meta: {
          title: '运输申请页',
          role: ['admin','ProcessTransportCreatePage']  // 页面需要的权限
        }
      }
    ]
  },
  {
    path: '/OAI',
    component: Layout,
    //redirect: '/funding-application/request',
    redirect: '/OAIpage',
    name: '出入库管理',
    meta: {
      title: '出入库管理',  // 显示在侧边栏中的名称
      icon: 'el-icon-lock',  // 显示在侧边栏中的图标
      role: ['admin','ProcessOAIPage']  // 页面需要的权限
    },
    children: [
      {
        path: '/OAIpage',
        component: () => import('@/views/OAI'),
        name: '出入库管理页',
        meta: {
          title: '出入库管理页',
          role: ['admin','ProcessOAIPage']  // 页面需要的权限
        }
      }
    ]
  },
  //任务管理
  //下级组织
//   {
//     path: '/subordinate-organization',
//     component: Layout,
//  //   redirect: '/subordinate-organization/subordinate-process-group',
//     alwaysShow: true,
//     name: '下级组织',
//     meta: {
//       title: '下级组织',  // 显示在侧边栏中的名称
//       icon: 'el-icon-s-management',  // 显示在侧边栏中的图标
//       role: ['admin']  // 页面需要的权限
//     },
//     children: [
//       {
//         path: 'subordinate-process-group',
//         component: () => import('@/views/subordinate organization/Subordinate Process Group'),
//         name: '下级工艺组',
//         meta: {
//           title: '下级工艺组',
//           role: ['admin']  // 页面需要的权限
//         }
//       }
//     ]
//   },
  //人员管理
//   {
//     path: '/personnel-configuration',
//     component: Layout,
//     //redirect: '/personnel-configuration/role-settings',
//     alwaysShow: true,
//     name: '人员配置',
//     meta: {
//       title: '人员配置',  // 显示在侧边栏中的名称
//       icon: 'el-icon-user',  // 显示在侧边栏中的图标
//       role: ['admin']  // 页面需要的权限
//     },
//     children: [
//       {
//         path: 'role-settings',
//         component: () => import('@/views/personnel configuration/Role Settings'),
//         name: '角色设置',
//         meta: {
//           title: '角色设置',
//           role: ['admin']  // 页面需要的权限
//         }
//       },
//       {
//         path: 'personnel-management',
//         component: () => import('@/views/personnel configuration/Personnel Management'),
//         name: '人员管理',
//         meta: {
//           title: '人员管理',
//           role: ['admin']  // 页面需要的权限
//         }
//       }
//     ]
//   },


{
  path: '/EmployeeManagement',
  component: Layout,
  redirect: '/EmployeeManagementview',
  name: '雇员管理',
  meta: { 
    title: '雇员管理', 
    icon: 'el-icon-user-solid',
    role: ['admin', 'EmployeeManagementPage','LogisticsStorehousePage','FundApprovalPage']
  },
  children: [{
    path: '/EmployeeManagementview',
    component: () => import('@/views/EmployeeManagement'),
    name: '雇员管理页',
    meta: {
      title: '雇员管理页',
      icon: 'el-icon-s-custom',
      role: ['admin', 'EmployeeManagementPage','LogisticsStorehousePage','FundApprovalPage'],
      breadcrumb: true  // 显示在面包屑中
    }
  }]
},

{
  path: '/VendorManagement',
  component: Layout,
  redirect: '/VendorManagementView',
  name: '供应商管理',
  meta: {
    title: '供应商管理',
    icon: 'el-icon-s-shop', // 这里可以根据你实际想用的图标进行替换，示例用了一个店铺图标样式
    role: ['admin','LogisticssupplierPage','LogisticsStorehousePage']
  },
  children: [
    {
      path: '/VendorManagementView',
      component: () => import('@/views/vendor/VendorManage'), // 指向我们之前写的供应商管理页面组件所在路径
      name: '供应商管理页',
      meta: {
        title: '供应商管理页',
        icon: 'el-icon-goods', // 同样可按需替换图标
        role: ['admin','LogisticssupplierPage','LogisticsStorehousePage'],
        // breadcrumb: true  // 如果你希望在面包屑中显示，可以取消注释这行
      }
    }
  ]
},

{
  path: '/FinanceManagement',
  component: Layout,
  redirect: '/FinanceManagementApproval',
  name: '财务管理',
  meta: { 
    title: '财务管理', 
    icon: 'el-icon-money',
    role: ['admin', 'fund','FundApprovalPage'] // 假设财务组的角色是 'fund'
  },
  children: [{
    path: '/FinanceManagementApproval',
    component: () => import('@/views/FinanceManagement/Approval'), // 假设资金审批页面的组件路径
    name: '资金审批',
    meta: {
      title: '资金审批',
      icon: 'el-icon-bank-card',
      role: ['admin', 'fund','FundApprovalPage'],
      breadcrumb: true  // 显示在面包屑中
    }
  }]
},

//仓库小组管理,就是仓库分为四类小组，这里可以创建、修改、删除每个小组。
{
  path: '/WarehouseGroupManagement',  // 路由路径
  component: Layout,  // 使用 Layout 作为父组件
  redirect: '/WarehouseGroupManagementView',  // 默认重定向到该页面
  name: '仓库小组管理',  // 路由的名字
  meta: {
    title: '仓库小组管理',  // 在菜单和面包屑中显示的标题
    icon: 'el-icon-warehouse',  // 仓库的图标
    role: ['admin', 'LogisticsGroupPage']  // 需要权限角色列表
  },
  children: [
    {
      path: '/WarehouseGroupManagementView',  // 子路由的路径
      component: () => import('@/views/warehouse/WarehouseGroupManage'),  // 动态导入仓库小组管理组件
      name: '仓库小组管理页',  // 子路由的名字
      meta: {
        title: '仓库小组管理页',  // 在菜单中显示的子标题
        icon: 'el-icon-box',  // 仓库小组图标
        role: ['admin', 'LogisticsGroupPage'],  // 需要权限角色
        // breadcrumb: true  // 如果希望在面包屑中显示，可以取消注释
      }
    }
  ]
},

//仓库管理,他能管理各个仓库，比如新建仓库删除仓库
{
  path: '/WarehouseManagement',
  component: Layout,
  redirect: '/WarehouseManagementView',
  name: '仓库管理',
  meta: {
    title: '仓库管理',
    icon: 'el-icon-s-home',  // 可以替换成合适的图标
    role: ['admin', 'LogisticsStorehousePage']  // 权限角色
  },
  children: [
    {
      path: '/WarehouseManagementView',
      component: () => import('@/views/warehouse/WarehouseManage'),  // 指向仓库管理页面组件
      name: '仓库管理页',
      meta: {
        title: '仓库管理页',
        icon: 'el-icon-location',  // 可以替换成合适的图标
        role: ['admin', 'LogisticsStorehousePage']  // 权限角色
      }
    }
  ]
},

//小组仓库管理页,他会显示和管理本小组能查看的仓库
{
  path: '/GroupWarehouseManagement',
  component: Layout,
  redirect: '/GroupWarehouseManagementView',
  name: '小组仓库管理',
  meta: {
    title: '小组仓库管理',
    icon: 'el-icon-store',  // 可替换为你想使用的图标
    role: ['admin', 'LogisticsItemLookPage']  // 权限控制
  }, 
  children: [
    {
      path: '/GroupWarehouseManagementView',
      component: () => import('@/views/warehouse/GroupWarehouseManage'),  // 引入小组仓库管理页面组件
      name: '小组仓库管理页',
      meta: {
        title: '小组仓库管理页',
        icon: 'el-icon-warehouse',  // 可替换为你想使用的图标
        role: ['admin', 'LogisticsItemLookPage'],  // 权限控制
      }
    }
  ]
},

 
{
  path: '/GroupWarehouseEntryExitManagement',
  component: Layout,
  redirect: '/GroupWarehouseEntryExitManagementView',
  name: '小组出入库管理',
  meta: {
    title: '小组出入库管理',
    icon: 'el-icon-truck',  // 可替换为你想使用的图标
    role: ['admin', 'LogisticsItemLookPage']  // 权限控制，可以根据你的角色进行修改
  },
  children: [
    {
      path: '/GroupWarehouseEntryExitManagementView',
      component: () => import('@/views/warehouse/GroupWarehouseEntryExitManage'),  // 引入管理出入库信息页面组件
      name: '小组出入库管理页',
      meta: {
        title: '小组出入库管理页',
        icon: 'el-icon-box',  // 可替换为你想使用的图标
        role: ['admin', 'LogisticsItemLookPage'],  // 权限控制
      }
    }
  ]
},

//库存管理页,他能查看每个仓库里都有啥。
{
  path: '/StorehouseInventory/:storehouse_id',  // 仓库ID作为动态参数
  component: Layout,
  redirect: '/StorehouseInventoryView/:storehouse_id',  // 进一步的跳转到具体视图
  name: '库存管理',
  meta: {
    title: '库存管理',
    icon: 'el-icon-goods',  // 可以选择适当的图标
    role: ['admin', 'LogisticsGroupPage'],  // 权限配置
  },
  children: [
    {
      path: '/StorehouseInventoryView/:storehouse_id',  // 路由视图页面路径
      component: () => import('@/views/warehouse/StorehouseInventory'),  // 该页面为我们实际的库存管理视图
      name: '库存管理页',
      meta: {
        title: '库存管理页',
        icon: 'el-icon-box',  // 同样可以自定义图标
        role: ['admin', 'LogisticsGroupPage'],  // 权限配置
        breadcrumb: true // 可以启用面包屑导航
      },
    },
  ],
},
 
{
  path: '/TransportTask/:task_id',  // 运输任务的动态路由，使用任务ID作为动态参数
  component: Layout,  // 使用主布局组件
  redirect: '/TransportTaskView/:task_id',  // 重定向到具体任务视图
  name: '运输任务管理',
  meta: {
    title: '运输任务管理',  // 页面标题
    icon: 'el-icon-truck',  // 可以选择合适的图标
    role: ['admin', 'LogisticsTransportPage'],  // 权限配置
  },
  children: [
    {
      path: '/TransportTaskView/:task_id',  // 动态任务ID路由视图路径
      component: () => import('@/views/warehouse/TransportTask'),  // 实际页面组件，负责显示运输任务详情
      name: '运输任务详情页',
      meta: {
        title: '运输任务详情页',
        icon: 'el-icon-truck',  // 可以选择适当的图标
        role: ['admin', 'LogisticsTransportPage'],  // 权限配置
        breadcrumb: true // 如果需要面包屑，可以启用
      },
    },
  ],
},
  


{
  path: '/TransportGroupTask/:task_id',  // 运输组任务的动态路由，使用任务ID作为动态参数
  component: Layout,  // 使用主布局组件
  redirect: '/TransportGroupTaskView/:task_id',  // 重定向到具体任务视图
  name: '运输组任务管理',
  meta: {
    title: '运输组任务管理',  // 页面标题
    icon: 'el-icon-truck',  // 可以选择合适的图标
    role: ['admin', 'LogisticsTaskPage'],  // 只有管理员和运输组角色能访问
  },
  children: [ 
    {
      path: '/TransportGroupTaskView/:task_id',  // 动态任务ID路由视图路径
      component: () => import('@/views/warehouse/TransportTask/TransportGroupTaskView'),  // 实际页面组件，负责显示运输组任务详情
      name: '运输组任务详情页',
      meta: {
        title: '运输组任务详情页',
        icon: 'el-icon-truck',  // 可以选择适当的图标
        role: ['admin', 'LogisticsTaskPage'],  // 权限配置
        breadcrumb: true // 启用面包屑
      },
    },
  ],
},
  

{
  path: '/apply-transport',  // 申请运输的路由路径
  component: Layout,         // 使用全局 Layout 组件
  redirect: '/apply-transport-view',  // 重定向到具体页面
  name: '申请运输',
  meta: {
    title: '申请运输',        // 页面标题
    icon: 'el-icon-truck',    // 页面图标，你可以根据需要选择适合的图标
    role: ['admin', 'LogisticssupplierPage'],  // 权限控制：只有管理员和LogisticssupplierPage角色能访问
  },
  children: [
    {
      path: '/apply-transport-view',  // 具体的申请运输页面
      component: () => import('@/views/warehouse/TransportTask/ApplyTransport'),  // 按需加载页面组件
      name: '申请运输页面',
      meta: {
        title: '申请运输页面',
        icon: 'el-icon-truck',  // 页面图标
        role: ['admin', 'LogisticssupplierPage'],  // 权限控制：只有指定角色能访问
        breadcrumb: true  // 启用面包屑
      },
    },
  ],
},

  { path: '*', redirect: '/404', hidden: true }
];

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})


const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router