import request from '@/utils/request'
import type { AllRouter } from './menu'
/**
 * +++++++++++++++++++++++++++++++++++
 * 类型
 * +++++++++++++++++++++++++++++++++++
 * **/
//图形验证码返回的格式
export interface Captcha {
	captchaKey: string
	base64: string
}
//登录提交的格式
export interface LoginData extends Pick<UserBase, 'account' | 'password' | 'tenantId'> {
	captchaKey: string
	captcha: string
}
// 登录返回的格式
export type LoginRes = Pick<UserBase, 'userId' | 'token'>
//获取用户信息
export interface UserInfo {
	userInfo: Pick<UserBase, 'account' | 'avatar' | 'birthday' | 'email' | 'name' | 'phone' | 'realName' | 'roleIds' | 'sex' | 'status' | 'tenantId' | 'tenantName' | 'userId' | 'userType' | 'topmenus' | 'isSuper'>
	menuList: Array<AllRouter>
	grantCodeList: Array<string>
}
//短信验证码登录
export type SmsLogin = {
	tenantId: string
	phone: string
	code: string
}

/**
 * +++++++++++++++++++++++++++++++++++
 * 接口
 * +++++++++++++++++++++++++++++++++++
 * **/
// 登录
export const userLogin: HTTPFunction<LoginRes> = data => request({ url: '/login', method: 'post', data })
// 获取登录验证码
export const getCaptcha: HTTPFunction<Captcha> = () => request({ url: '/getCaptcha', method: 'post' })
// 获取用户信息
export const getUserInfo: HTTPFunction<UserInfo> = () => request({ url: '/sys/sysUser/getUserInfo', method: 'post' })
//忘记密码
export const forgetPsw: HTTPFunction<boolean, { phone: string; code: string; newPassword: string }> = data => request({ url: '/sys/sysUser/verCodePassword', method: 'post', data })
// 短信验证码登录
export const smsLogin: HTTPFunction<LoginRes, SmsLogin> = data => request({ url: '/smsLogin', method: 'post', data })
