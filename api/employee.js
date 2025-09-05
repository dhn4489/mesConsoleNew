import request from '@/utils/request'

// 注册雇员
export function registerEmployee(data) {
  const url = `/api/user/register`;
  return request({
    url: url,
    method: 'post',
    data: data
  });
}
// 根据雇员id获取雇员信息
export function getEmployeeById(employeeId) {
  const url = `/api/user/getUserById/${employeeId}`;
  return request({
    url: url,
    method: 'get'
  });
}

// 更新用户信息
export function updateUserInfo(data) {
  const url = `/api/user/updateInfo`;
  return request({
    url: url,
    method: 'put',
    data: data
  });
}

// 删除用户信息
export function deleteUserById(employeeId) {
  const url = `/api/user/deleteById/${employeeId}`;
  return request({
    url: url,
    method: 'delete'
  });
}

// 获取所有用户
export function getAllUsers() {
  const url = `/api/user/getAllUser`;
  return request({
    url: url,
    method: 'get'
  });
}