import request from '@/utils/request'
import store from '@/store'
const groupname=store.getters.member
const foreignid=store.getters.foreignid
export function gettaskDecomposition(data) {
    //const { groupname, foreignid } = data;

    // 动态生成 URL
    const url = `/api/${groupname}/${foreignid}/taskDecomposition`;
    return request({
      url: url,
      method: 'get',
     // params: { token }
    })
  }
  export function Createtask(data) {
    // 动态生成 URL
    const url = `/api/${groupname}/${foreignid}/CreateTask`;
  
    // 使用 data 发送请求体内容
    return request({
      url: url,
      method: 'post',
      data: data  // 将 data 放在请求体中
    });
  }
  export function UpdateTask(data) {
    // 动态生成 URL
    const url = `/api/${groupname}/${foreignid}/UpdateTask`;
  
    // 使用 data 发送请求体内容
    return request({
      url: url,
      method: 'put',
      data: data  // 将 data 放在请求体中
    });
  }
  // export function DeleteTask(data) {
  //   // 动态生成 URL
  //   const url = `/api/${groupname}/${foreignid}/UpdateTask`;
  
  //   // 使用 data 发送请求体内容
  //   return request({
  //     url: url,
  //     method: 'post',
  //     data: data  // 将 data 放在请求体中
  //   });
  // }
  // GET 请求: /api/processGroup/{processGroupId}/getTaskData/{taskId}
export function getTaskData(taskId) {
  const url = `/api/${groupname}/${foreignid}/getTaskData/${taskId}`;
  return request({
    url: url,
    method: 'get'
  });
}

// POST 请求: /api/processGroup/{processGroupId}/insertTaskData
export function insertTaskData(data) {
  const url = `/api/${groupname}/${foreignid}/insertTaskData`;
  return request({
    url: url,
    method: 'post',
    data: data  // 发送请求体数据
  });
}

// POST 请求: /api/processGroup/{processGroupId}/generateSummary/{taskId}
export function generateSummary(taskId) {
  const url = `/api/${groupname}/${foreignid}/generateSummary/${taskId}`;
  return request({
    url: url,
    method: 'post'
  });
}

// GET 请求: /api/processGroup/{processGroupId}/getSummaryByTaskId/{taskId}
export function getSummaryByTaskId(taskId) {
  const url = `/api/${groupname}/${foreignid}/getSummaryByTaskId/${taskId}`;
  return request({
    url: url,
    method: 'get'
  });
}