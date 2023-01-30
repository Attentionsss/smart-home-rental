import axios from 'axios'

export const getCurrentCity = () => {
  const localCity = JSON.parse(window.localStorage.getItem('hkzf_city'))
  if (!localCity) {
    return new Promise((resolve, reject) => {
      const currenCity = new window.BMapGL.LocalCity()
      currenCity.get(async (city) => {
        try {
          // console.log(res)
          const { data: res } = await axios.get(
            `http://localhost:8080/area/info?name=${city.name}`
          )
          window.localStorage.setItem('hkzf_city', JSON.stringify(res.body))
          resolve(res.body)
        } catch (e) {
          reject(e)
        }
      })
    })
  }
  return Promise.resolve(localCity)
}

export { BASE_URL } from './url.js'
export { API } from './api.js'
export * from './auth.js'
export * from './city'
