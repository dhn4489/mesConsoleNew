import request from '@/utils/request'
import store from '@/store'

// 获取当前项目组名称和ID
const groupname = store.getters.member
const foreignid = store.getters.foreignid

// 获取权限
export function getPermission() {
  const url = `/api/${groupname}/${foreignid}/getPermission`
  return request({
    url: url,
    method: 'get'
  })
}

// 获取角色
export function getRole() {
  const url = `/api/${groupname}/${foreignid}/getRole`
  return request({
    url: url,
    method: 'get'
  })
}

// 更新角色
export function updateRole(data) {
  const url = `/api/${groupname}/${foreignid}/updateRole`
  return request({
    url: url,
    method: 'put',
    data: data
  })
}

// 添加角色
export function addRole( data) {
  const url = `/api/${groupname}/${foreignid}/addRole`
  return request({
    url: url,
    method: 'post',
    data: data
  })
}
