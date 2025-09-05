import request from '@/utils/request'

// 获取财务组可用权限
export function getFinancePermission() {
  return request({
    url: '/api/fund/1/getPermission',
    method: 'get'
  })
}

// 更新资金审批
export function updateFundApproval(data) {
  return request({
    url: '/api/fund/1/updateFundApproval',
    method: 'put',
    data: data
  })
}

// 查看资金审批
export function getFundApprovalStatusList() {

  console.log(`组别和ID
    组别和ID
    组别和ID
    组别和ID`);
  return request({
    url: '/api/fund/1/fundApprovalStatusList',
    method: 'get'
  })
}