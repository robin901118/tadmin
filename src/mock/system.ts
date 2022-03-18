import { responseResult } from './mixin'
import { MockMethod } from 'vite-plugin-mock'

export default function systemApis(): Array<MockMethod> {
	return [
		/**
		 * +++++++++++++++++++++++++++++++++++++++++++++++++
		 * 获取签名直传
		 * +++++++++++++++++++++++++++++++++++++++++++++++++
		 * */
		{
			url: '/sys/oss/getSign',
			method: 'post',
			response: () => {
				return responseResult({
					data: {
						dir: '/upload',
						policy: '469579873132',
						accessId: 'asdkgi232156qwe3',
						signature: 'qweuiyZ213bqw4234b',
						host: 'https://tupian.qqw21.com/article/UploadPic/2020-11/'
					}
				})
			}
		},

		/**
		 * +++++++++++++++++++++++++++++++++++++++++++++++++
		 * 获取短信验证码
		 * +++++++++++++++++++++++++++++++++++++++++++++++++
		 * */
		{
			url: '/sys/sms/sendCode',
			method: 'post',
			response: () => {
				return responseResult({ data: true })
			}
		}
	]
}
