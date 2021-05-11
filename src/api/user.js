import request from '@/utils/request'

export function save_user_info(data) {
  return request({
    url: '/user/add',
    method: 'post',
    data
  })
}

export function edit_user_info(data){
  return request({
    url: '/user/edit',
    method: 'post',
    data
  })
}

export function login(data) {
  return request({
    url: '/login/checklogin',
    method: 'post',
    data: { code: data.username, pwd: data.password }
  })
}

export function getInfo(token) {
  return request({
    url: '/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/login/logout',
    method: 'post'
  })
}

export function userlist(data) {
  return request({
    method: 'post',
    url: '/user/list',
    data: data
  })
}
