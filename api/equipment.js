import request from '@/utils/request'
import store from '@/store'

// 获取当前项目组名称和ID
const groupname = store.getters.member
const foreignid = store.getters.foreignid
// 获取设备信息
export function getEquipmentByProcessGroupId() {
    const url = `/api/processGroup/${foreignid}/getEquipmentByprocessGroupId`
    return request({
      url: url,
      method: 'get'
    })
  }
// 插入设备信息
export function insertEquipment(data) {
    const url = `/api/processGroup/${foreignid}/insertEquipment`
    return request({
      url: url,
      method: 'post',
      data: data
    })
  }
// 更新设备信息
export function updateEquipment( data) {
    const url = `/api/processGroup/${foreignid}/updateEquipment`
    return request({
      url: url,
      method: 'put',
      data: data
    })
  }
// 删除设备
export function deleteEquipment( equipmentId) {
    const url = `/api/processGroup/${foreignid}/deleteEquipment/${equipmentId}`
    return request({
      url: url,
      method: 'delete'
    })
  }
// 获取维修信息
export function getMaintenanceByProcessGroupId() {
    const url = `/api/processGroup/${foreignid}/getMaintenanceByProcessGroupId`
    return request({
      url: url,
      method: 'get'
    })
  }
// 添加维修信息
export function addMaintenance(data) {
    const url = `/api/processGroup/${foreignid}/addMaintenance`
    return request({
      url: url,
      method: 'post',
      data: data
    })
  }
// 更新维修信息
export function updateMaintenance(data) {
    const url = `/api/processGroup/${foreignid}/updateMaintenance`
    return request({
      url: url,
      method: 'put',
      data: data
    })
  }
// 删除维修信息
export function deleteMaintenance( maintenanceId) {
    const url = `/api/processGroup/${foreignid}/deleteMaintenance/${maintenanceId}`
    return request({
      url: url,
      method: 'delete'
    })
  }
                