import axios from 'axios'


const httpClient = axios.create({
    baseURL: '/api'
})

httpClient.interceptors.response.use(response => {
    return response.data
}, error => {
    return Promise.reject(error)
})

export {httpClient}
