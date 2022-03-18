import request from '@/utils/request'

export interface Policy {
	readonly accessId: string
	readonly host: string
	readonly dir: string
	readonly signature: string
	readonly policy: string
	readonly expire: string
}

// 获取oss签名参数
export const getPolicy: HTTPFunction<Policy> = () => request({ url: '/sys/oss/getSign', method: 'post' })
//通过手机号获取验证码
export const getSmsCode: HTTPFunction<boolean, { phone: string }> = data => request({ url: '/sys/sms/sendCode', method: 'post', data })
