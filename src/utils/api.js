import axios from 'axios'
import { BASE_URL } from './url'
import { getToken, removeToken } from './auth'

const API = axios.create({
  baseURL: BASE_URL,
})

API.interceptors.request.use((config) => {
  const { url } = config
  if (
    url.startsWith('/user') &&
    !url.startsWith('/user/login') &&
    !url.startsWith('/user/registered')
  ) {
    config.headers.Authorization = getToken()
  }
  return config
})
API.interceptors.response.use((res) => {
  const { status } = res.data
  // console.log(res)
  if (status === 400) {
    removeToken()
  }
  return res
})
export { API }
