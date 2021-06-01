import axios from 'axios'
import { Message } from 'element-ui'
import Global from '../global'

const instance = axios.create({
    timeout: 60000,
    baseURL: './api'
    // baseURL: 'http://192.168.123.60:8085'
})

const httpCode = {
    400: '请求参数错误',
    401: '权限不足, 请重新登录',
    403: '服务器拒绝本次访问',
    404: '请求资源未找到',
    500: '内部服务器错误',
    501: '服务器不支持该请求中使用的方法',
    502: '网关错误',
    504: '网关超时'
}

instance.interceptors.request.use(config => {
    config.headers.Authorization = getToken()
    return config
}, error => {
    Message.error({ message: '加载超时' })
    return Promise.reject(error)
})

instance.interceptors.response.use(response => {
    if (response.data.status === 401) {
        Message.error(httpCode[401])

        setTimeout(() => {
            localStorage.clear()
            Global.isCreateShow = false
            Global.isShow = true
        }, 300)
    }
    return response
}, error => {
    if (error.response) {
        const tips = error.response.status in httpCode ? httpCode[error.response.status] : error.response.data.message
        Message.error({ message: error.response.data.message })
        return Promise.reject(new Error(tips))
    } else {
        Message.error({ message: '请求超时, 请刷新重试' })
        return Promise.reject(new Error('请求超时, 请刷新重试'))
    }
})

export const get = (url, params, config = {}) => {
    return new Promise((resolve, reject) => {
        instance({
            method: 'get',
            url,
            params,
            ...config
        }).then(response => {
            resolve(response)
        }).catch(error => {
            reject(error)
        })
    })
}

export const post = (url, data, config = {}) => {
    return new Promise((resolve, reject) => {
        instance({
            method: 'post',
            url,
            data,
            ...config
        }).then(response => {
            if (response.data.code == 0) { resolve(response) } else {
                Message.error(response.data.message)
                reject(response.data.message)
            }
        }).catch(error => {
            reject(error)
        })
    })
}

export const put = (url, data, config = {}) => {
    return new Promise((resolve, reject) => {
        instance({
            method: 'put',
            url,
            data,
            ...config
        }).then(response => {
            if (response.data.code == 0) { resolve(response) } else {
                Message.error(response.data.message)
                reject(response.data.message)
            }
        }).catch(error => {
            reject(error)
        })
    })
}

export const Delete = (url, data, config = {}) => {
    return new Promise((resolve, reject) => {
        instance({
            method: 'delete',
            url,
            data,
            ...config
        }).then(response => {
            if (response.data.code == 0) { resolve(response) } else {
                Message.error(response.data.message)
                reject(response.data.message)
            }
        }).catch(error => {
            reject(error)
        })
    })
}

export const getToken = () => {
    let token
    if (localStorage.getItem('userInfo')) {
        token = localStorage.getItem('userInfo')
        return token
    } else {
        return null
    }
}