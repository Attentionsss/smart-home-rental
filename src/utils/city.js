const TOKEN_NAME = 'hkzf_city'

const getCity = () => JSON.parse(localStorage.getItem(TOKEN_NAME)) || {}

const setCity = (val) => localStorage.setItem(TOKEN_NAME, val)

export { getCity, setCity }
