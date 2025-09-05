import request from '@/utils/request'
import store from '@/store'

// 获取项目组ID
const groupname = store.getters.member
const foreignid = store.getters.foreignid

// 获取所有项目
export function getAllProject() {
    const url = `/api/business/${foreignid}/getAllProject`
    return request({
        url: url,
        method: 'get'
    })
}

// 添加项目
export function addProject(data) {
    const url = `/api/business/${foreignid}/addProject`
    return request({
        url: url,
        method: 'post',
        data: data
    })
}

// 更新项目
export function updateProject(data) {
    const url = `/api/business/${foreignid}/updateProject`
    return request({
        url: url,
        method: 'put',
        data: data
    })
}
