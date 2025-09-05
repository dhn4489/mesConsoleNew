import request from '@/utils/request'
import store from '@/store'

// 获取当前项目组名称和ID
const groupname = store.getters.member
const foreignid = store.getters.foreignid
// 获取下属项目组
export function getSubordinateGroup() {
    const url = `/api/${groupname}/${foreignid}/getSubordinateGroup`
    return request({
      url: url,
      method: 'get'
    })
  }
// 创建下属项目组
export function subordinateGroupCreate(data) {
    const url = `/api/${groupname}/${foreignid}/subordinateGroupCreate`
    return request({
      url: url,
      method: 'post',
      data: data
    })
  }
  export function getProject() {
    const url = `/api/project/getAllProject`
    return request({
      url: url,
      method: 'get'
    })
  }