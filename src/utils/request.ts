import axios, { Axios, AxiosInstance, AxiosPromise, AxiosRequestConfig, AxiosResponse } from 'axios'
import qs from 'qs'
import { isEmpty } from 'lodash'
import { ElNotification } from 'element-plus'
import 'element-plus/theme-chalk/src/notification.scss'
import { getToken, removeToken } from './auth'
import { request_header_token, code_white_list } from '@/config'

interface RequestConfigType {
	[propsName: number]: string
}
interface myPromise<T = any> extends Promise<T> {}
interface RequestInstance extends Axios {
	(config: AxiosRequestConfig): myPromise
	(url: string, config?: AxiosRequestConfig): myPromise
}

// 请求错误码白名单（这个白名单内的错误码不进行弹窗提示）
const baseURL: string = import.meta.env.VITE_APP_BASE_API
const service: RequestInstance = axios.create({
	baseURL,
	timeout: 100000,
	headers: { 'Content-Type': 'application/json' }
})

service.interceptors.request.use(
	(config: AxiosRequestConfig) => {
		// 设置token
		const token: string | undefined = getToken()
		token && (config.headers[request_header_token] = token)

		// 根据请求类型格式化参数
		if (config.method === 'post') {
			config.data = JSON.stringify(config.data) // 序列化参数
		} else if (config.method === 'get') {
			if (config.data && !isEmpty(config.data)) {
				config.url += '?'
				config.url += qs.stringify(config.data)
			}
		} else {
			config.params = config.data
		}

		return config
	},
	async error => await Promise.reject(error)
)

service.interceptors.response.use(
	(response: AxiosResponse) => {
		const { data, code, message, msg } = response.data
		if (code === 200) return data
		if (!code_white_list.has(code)) {
			if (code === 401) removeToken()
			ElNotification({
				title: '请求错误',
				message: message || msg || '没有错误信息',
				type: 'error',
				showClose: false
			})
		}
		/* eslint-disable */
		return Promise.reject({ code, message, msg })
	},
	error => {
		// @ts-ignore
		ElNotification({
			title: '请求错误',
			message: `${error?.message || '网络开小差了~'}`,
			type: 'error',
			showClose: false
		})
		/* eslint-disable */
		return Promise.reject(error)
	}
)
export default service
