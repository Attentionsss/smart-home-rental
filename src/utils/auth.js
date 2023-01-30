const TOKEN_NAME = 'hkzf_token'

// 获取token
const getToken = () => {
  return localStorage.getItem(TOKEN_NAME)
}

// 设置token
const setToken = (val) => localStorage.setItem(TOKEN_NAME, val)

// 移除token
const removeToken = () => {
  return localStorage.removeItem(TOKEN_NAME)
}

//是否登录
const isAuth = () => !!getToken()

export { getToken, setToken, removeToken, isAuth }
