import request from '@/utils/request'
import store from '@/store'

// 获取当前项目组名称和ID
const groupname = store.getters.member
const foreignid = store.getters.foreignid

// 添加成员
export function addMember(data) {
  const url = `/api/${groupname}/${foreignid}/addMember`
  return request({
    url: url,
    method: 'post',
    data: data
  })
}

// 获取项目组人员管理数据
export function getPersonnelManagement() {
  const url = `/api/${groupname}/${foreignid}/personnelManagement`
  return request({
    url: url,
    method: 'get'
  })
}

// 获取所有用户
export function getAllUser() {
  const url = `/api/user/getAllUser`
  return request({
    url: url,
    method: 'get'
  })
}
export function updateMember(data) {
    const url = `/api/${groupname}/${foreignid}/updateMember`
    return request({
      url: url,
      method: 'put',
      data: data
    })
  }
  // 删除成员
export function deleteMember( memberId) {
    const url = `/api/${groupname}/${foreignid}/deleteMember/${memberId}`
    return request({
      url: url,
      method: 'delete'
    })
  }