import Cookies from 'js-cookie'

const TokenKey = 'vue_admin_token'
const MenuKey = 'vue_admin_menu'
const UserInfoKey = 'vue_admin_userinfo'
export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function setUserInfo(userinfo) {
  return sessionStorage.setItem(UserInfoKey, userinfo)
}
export function getUserInfo() {
  return sessionStorage.getItem(UserInfoKey)
}

export function setUserMenus(menus) {
  return sessionStorage.setItem(MenuKey, menus)
}
export function getUserMenus() {
  return sessionStorage.getItem(MenuKey)
}
