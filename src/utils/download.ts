import axios from 'axios'
import { ElMessage, ElNotification } from 'element-plus'
import { getToken } from '@/utils/auth'
import { request_header_token } from '@/config'
import { saveAs } from 'file-saver'

export default async function (requestUrl: string, method: any, params: any = {}): Promise<void> {
	const baseURL: string = await import.meta.env.VITE_APP_BASE_API
	const http = axios.create({
		baseURL,
		timeout: 30000,
		headers: {
			[request_header_token]: getToken()
		}
	})

	http.interceptors.request.use(config => {
		//设置请求取消
		config.cancelToken = new axios.CancelToken(cancel => {
			//@ts-ignore
			!window.__axiosPromiseArr && (window.__axiosPromiseArr = [])
			//@ts-ignore
			window.__axiosPromiseArr.push({ cancel })
		})
		return config
	})

	return new Promise((resolve, reject) => {
		http({
			url: requestUrl,
			params: method.toLowerCase() === 'get' ? params : undefined,
			data: method.toLowerCase() === 'post' ? params : undefined,
			method,
			responseType: 'blob'
		})
			.then(res => {
				try {
					const fileName = decodeURI(res.headers['content-disposition'].split(';')[1].split('=')[1])
					saveAs(res.data, fileName)
					resolve()
				} catch (e) {
					ElNotification({
						title: '下载错误',
						message: '请求错误，请联系管理员',
						type: 'error'
					})
					reject()
				}
			})
			.catch(error => {
				ElMessage({
					message: error.message || '导出失败！',
					type: 'error'
				})
				reject()
			})
	})
}
