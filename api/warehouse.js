import request from '@/utils/request'
import store from '@/store'

// 获取当前项目组名称和ID
const groupname = 'logisticsteam'//store.getters.member
const foreignid = store.getters.foreignid
 
// 查看所有供应商
export function getAllSupplier() {
  const url = `/api/${groupname}/${foreignid}/getALlSupplier`
  // console.log("组别和ID" + "\n" + "组别和ID" + "\n" + "组别和ID" + "\n" + "组别和ID");
  // console.log(groupname+ "\n")
  // console.log(foreignid+ "\n")
  return request({
    url: url,
    method: 'get'
  })
}

// 新建供应商
export function insertSupplier(data) {
  const url = `/api/${groupname}/${foreignid}/insertSupplier`
  return request({
    url: url,
    method: 'post',
    data: data
  })
}

// 修改供应商信息
export function updateSupplier(data) {
  const url = `/api/${groupname}/${foreignid}/updateSupplier`
  return request({
    url: url,
    method: 'put',
    data: data
  })
}

// 删除供应商
export function deleteSupplier(supplierId) {
  const url = `/api/${groupname}/${foreignid}/deleteSupplier/${supplierId}`
  return request({
    url: url,
    method: 'delete'
  })
}  
  
// 获取物流组列表
export function getAllLogisticsteam() {
  const url = `/api/${groupname}/${foreignid}/getAllLogisticsteam`
  return request({
    url: url,
    method: 'get'
  })
}
  
// 添加物流组
export function insertLogisticsteam(data) {
  const url = `/api/${groupname}/${foreignid}/insertLogisticsteam/`
  console.log(url);
  console.log(data);
  return request({
    url: url,
    method: 'post',
    data: data
  })
}

// 更新物流组
export function updateLogisticsteam(data) {
  const url = `/api/${groupname}/${foreignid}/updateLogisticsteam/`
  return request({
    url: url,
    method: 'put',
    data: data
  })
}

// 删除物流组
export function deleteLogisticsteam(logisticsteamId) {
  const url = `/api/${groupname}/${foreignid}/deleteLogisticsteam/${logisticsteamId}`
  return request({
    url: url,
    method: 'delete'
  })
}

// 查看某一仓库
export function getStoreHouseById(storehouseId) {
  const url = `/api/${groupname}/${foreignid}/getStoreHouseById/${storehouseId}`;
  return request({
    url: url,
    method: 'get'
  });
}

// 查看所有仓库
export function getAllStorehouses() {
  const url = `/api/${groupname}/${foreignid}/getAllStorehouses`;
  return request({
    url: url,
    method: 'get'
  });
}


// 新建仓库
export function insertStoreHouse(data) {
  //console.log(data);
  const url = `/api/${groupname}/${foreignid}/insertStoreHouse`;
  return request({
    url: url,
    method: 'post',
    data: data
  });
}


// 修改仓库信息
export function updateStoreHouse(data) {
  const url = `/api/${groupname}/${foreignid}/updateStoreHouse`;
  return request({
    url: url,
    method: 'put',
    data: data
  });
}

 
// 删除仓库
export function deleteStoreHouse(storehouseId) {
  const url = `/api/${groupname}/${foreignid}/deleteStoreHouse/${storehouseId}`;
  return request({
    url: url,
    method: 'delete'
  });
}


// 查看仓库组管理的仓库
export function getStorehouseByGroup() {
  const url = `/api/${groupname}/${foreignid}/getStorehouseByGroup`;
  return request({
    url: url,
    method: 'get'
  });
}

// 查看某一库存
export function getItemById(logisticsteam_id, item_id) {
  const url = `/api/${groupname}/${foreignid}/getItemById/${item_id}`;
  return request({
    url: url,
    method: 'get',
  });
}

// 查看所有库存
export function getAllItem() {
  const url = `/api/${groupname}/${foreignid}/getALLItem`;
  return request({
    url: url,
    method: 'get',
  });
}

// 新建库存
export function insertItem(data) {
  const url = `/api/${groupname}/${foreignid}/insertItem`;
  return request({
    url: url,
    method: 'post',
    data: data,
  });
}

// 修改某一库存信息
export function updateItem(data) {
  const url = `/api/${groupname}/${foreignid}/updateItem`;
  return request({
    url: url,
    method: 'put',
    data: data,
  });
}

// 删除某一库存
export function deleteItem(item_id) {
  const url = `/api/${groupname}/${foreignid}/deleteItem/${item_id}`;
  return request({
    url: url,
    method: 'delete',
  });
}

// 查看某一仓库组所管理仓库中所有的库存
export function getItemByStoreGroupId(logisticsteam_id) {
  const url = `/api/${groupname}/${logisticsteam_id}/getItemByStoreGroupId`;
  return request({
    url: url,
    method: 'get',
  });
}
   
// 查看运输请求
export function getTransportRequest(logisticsteamId) {
  const url = `/api/logisticsteam/${logisticsteamId}/getTransportRequest`;
  return request({
    url: url,
    method: 'get',
  });
}  
// 查看所有运输任务
export function getAllTransportTasks(logisticsteamId) {
  const url = `/api/logisticsteam/${logisticsteamId}/getTransportTask`;
//   console.log(response.data);
  return request({
    url: url,
    method: 'get',
  });
}    
// 运输组查负责的运输任务
export function getTransportByManagerId(logisticsteamId, managerId) {
  const url = `/api/logisticsteam/${logisticsteamId}/getTransportByManagerId`;
  return request({
    url: url,
    method: 'get',
  });
}
// 修改任务
export function updateTransportRequest(logisticsteamId, data) {
  console.log(data);
  const url = `/api/logisticsteam/${logisticsteamId}/updateTransportRequest`;
  return request({
    url: url,
    method: 'put',
    data: data,
  });
}  
// 执行任务
export function executeTransport(logisticsteamId, data) {
  const url = `/api/logisticsteam/${logisticsteamId}/updateTransport`;
  return request({
    url: url,
    method: 'put',
    data: data,
  });
}
// 删除运输任务
export function deleteTransportTask(logisticsteamId, taskId) {
  const url = `/api/logisticsteam/${logisticsteamId}/deleteTransportTask/${taskId}`;
  return request({
    url: url,
    method: 'delete',
  });
}

//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!注意
// 获取当前用户角色
export function getUserRoles() {
  const url = '/api/business/${foreignid}/Role';
  return request({
    url: url,
    method: 'get',
  });
}

// 1. 查询某一仓库组相关的出入库信息
export function getOAIByStoreGroup(logisticsteamId) {
  const url = `/api/logisticsteam/${logisticsteamId}/getOAIByStoreGroup`;
  return request({
    url: url,
    method: 'get',
  });
}

// 2. 创建入库出库信息
export function createOAI(logisticsteamId, data) {
  const url = `/api/logisticsteam/${logisticsteamId}/insertOAI`;
  return request({
    url: url,
    method: 'post',
    data: data,
  });
}

// 3. 修改入库出库信息（确认）
export function updateOAI(logisticsteamId, data) {
  const url = `/api/logisticsteam/${logisticsteamId}/updateOAI`;
  return request({
    url: url,
    method: 'put',
    data: data,
  });
}

// 4. 删除入库出库信息
export function deleteOAI(logisticsteamId, oaiId) {
  const url = `/api/logisticsteam/${logisticsteamId}/deleteOAI/${oaiId}`;
  return request({
    url: url,
    method: 'delete',
  });
}

// 创建运输任务请求
export function createTransportTask(logisticsteamId, data) {
  const url = `/api/logisticsteam/${logisticsteamId}/insertTransportTask`;
  return request({
    url: url,
    method: 'post',
    data: data, // 请求体参数
  });
}
