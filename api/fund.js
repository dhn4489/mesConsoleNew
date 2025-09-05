import request from '@/utils/request'
import store from '@/store'

// 获取当前项目组名称和ID
const groupname = store.getters.member
const foreignid = store.getters.foreignid

// 获取资金审批状态列表
export function getFundApprovalStatusList() {
  const url = `/api/${groupname}/${foreignid}/fundApprovalStatusList`
  return request({
    url: url,
    method: 'get'
  })
}

// 创建资金审批
export function createFundApproval(data) {
  const url = `/api/${groupname}/${foreignid}/createFundApproval`
  return request({
    url: url,
    method: 'post',
    data: data
  })
}

// 更新资金审批
export function updateFundApproval(data) {
  const url = `/api/${groupname}/${foreignid}/updateFundApproval`
  return request({
    url: url,
    method: 'put',
    data: data
  })
}
