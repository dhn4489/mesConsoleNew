import request from '@/utils/request'
export function login(data) {
 // console.log('data',data)
  return request({
    url: '/api/user/login',
    method: 'post',
    data
  })
}
// 一次登陆
export function beforelogin(data) {
  return request({
    url: '/api/validateUser',
    method: 'post',
    data
  })
}

export function getProjects(data) {
  return request({
    url: '/api/members/byEmployee',
       method: 'get',
    data
  })
}

export function getInfo(data) {
  const { groupname, foreignid } = data;

  // 动态生成 URL
  const url = `/api/${groupname}/${foreignid}/Role`;
  return request({
    url: url,
    method: 'get',
   // params: { token }
  })
}

export function logout(data) {
  return request({
   
      // url: '/api/logout',
      //    method: 'post',
      // data
      url: '/api/members/byEmployee',
      method: 'get',
   data
  })
}
