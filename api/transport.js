import request from '@/utils/request'
import store from '@/store'

// 获取当前项目组名称和ID
const groupname = store.getters.member
const foreignid = store.getters.foreignid

// 创建运输请求
export function createTransportRequest(data) {
  const url = `/api/${groupname}/${foreignid}/createTransportRequest`
  return request({
    url: url,
    method: 'post',
    data: data
  })
}

// 获取 OAI 数据
export function getTransportRequest() {
  const url = `/api/${groupname}/${foreignid}/getTransportRequest`
  return request({
    url: url,
    method: 'get'
  })
}

// 更新 OAI 数据
export function updateOAI(data) {
  const url = `/api/${groupname}/${foreignid}/updateOAI`
  return request({
    url: url,
    method: 'put',
    data: data
  })
}
