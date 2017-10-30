import axios from 'axios'

let base = 'http://localhost:8080'

export const reqUserInfo = params => { return axios.get(`${base}/sell/ebay/user/list`, {params: params}) }

