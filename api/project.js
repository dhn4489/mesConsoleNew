import request from '@/utils/request'
import store from '@/store'
const groupname=store.getters.member
const foreignid=store.getters.foreignid
export function getprojectOverview(data) {
    //const { groupname, foreignid } = data;

    // 动态生成 URL
    const url = `/api/${groupname}/${foreignid}/projectOverview`;
    return request({
      url: url,
      method: 'get',
     // params: { token }
    })
  }