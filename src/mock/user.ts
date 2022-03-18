import { responseResult } from './mixin'
import { MockMethod, Recordable } from 'vite-plugin-mock'
import type { AllUsers, AddUser, UpdateUser } from '@/api/system/user'
import { menus, delButtonRouter } from './menu'
import Mock from 'mockjs'
import { nanoid } from 'nanoid'
import { slice, findIndex } from 'lodash'

Mock.Random.extend({
	phone: function () {
		const phonePrefixs = ['132', '133', '134', '138', '137', '136', '135', '131', '139', '166', '188']
		return this.pick(phonePrefixs) + Mock.mock(/\d{8}/)
	}
})

const users: Array<AllUsers> = []
for (let i = 0; i < Mock.Random.integer(100, 500); i++) {
	users.push(
		Mock.mock({
			account: '@word(8,16)',
			avatar: "@image('80x80','#02adea')",
			birthday: '@date',
			email: '@email',
			name: '@name',
			password: '@word(2,4)',
			phone: '@phone',
			realName: '@cname',
			roleIds: '1,2',
			sex: '@integer(1,2)',
			status: '@integer(1,2)',
			userId: nanoid(),
			tenantId: 1,
			tenantName: '管理组'
		}) as AllUsers
	)
}

export default function userApis(): Array<MockMethod> {
	return [
		/**
		 * +++++++++++++++++++++++++++++++++++++++++++++++++
		 * 获取获取当前用户信息
		 * +++++++++++++++++++++++++++++++++++++++++++++++++
		 * */
		{
			url: '/sys/sysUser/getUserInfo',
			method: 'post',
			response: () =>
				responseResult({
					data: {
						userInfo: {
							account: 'admin',
							birthday: '1999-09-09',
							email: '123456@qq.com',
							realName: '赵波',
							sex: 1,
							status: 1,
							tenantId: 1,
							isSuper: 1,
							tenantName: '管理组',
							userType: '',
							avatar: 'https://tse1-mm.cn.bing.net/th/id/OIP-C.B_YbNReMi08e-skQPAXFxAAAAA?pid=ImgDet&rs=1',
							userId: 9999,
							phone: '13110752807',
							name: 'Admin',
							roleIds: '1,2',
							topmenus: [
								{
									sort: 0,
									topmenuCode: 'cscc',
									topmenuIcon: 'LocationFilled',
									topmenuId: 1,
									topmenuName: '顶部菜单'
								},
								{
									sort: 1,
									topmenuCode: 'qxgl',
									topmenuIcon: 'Shop',
									topmenuId: 2,
									topmenuName: '权限管理'
								}
							]
						},
						menuList: delButtonRouter(menus)
					}
				})
		},

		/**
		 * +++++++++++++++++++++++++++++++++++++++++++++++++
		 * 获取所有用户
		 * +++++++++++++++++++++++++++++++++++++++++++++++++
		 * */
		{
			url: '/sys/sysUser/list',
			method: 'post',
			timeout: 800,
			response: ({ body }: Recordable) => {
				if (body.size && body.page) {
					return responseResult({
						data: {
							list: slice(users, body.page * body.size - body.size, body.size * body.page),
							total: users.length
						}
					})
				} else {
					return responseResult({
						code: 4578,
						message: '请传入size和page'
					})
				}
			}
		},

		/**
		 * +++++++++++++++++++++++++++++++++++++++++++++++++
		 * 账号密码登录
		 * +++++++++++++++++++++++++++++++++++++++++++++++++
		 * */
		{
			url: '/login',
			method: 'post',
			response: () => {
				return responseResult({
					data: {
						userId: 5,
						token: '0nigajsdg8569'
					}
				})
			}
		},

		/**
		 * +++++++++++++++++++++++++++++++++++++++++++++++++
		 * 短信验证码登录
		 * +++++++++++++++++++++++++++++++++++++++++++++++++
		 * */
		{
			url: '/smsLogin',
			method: 'post',
			response: () => {
				return responseResult({
					data: {
						userId: 5,
						token: '0nigajsdg8569'
					}
				})
			}
		},

		/**
		 * +++++++++++++++++++++++++++++++++++++++++++++++++
		 * 忘记密码
		 * +++++++++++++++++++++++++++++++++++++++++++++++++
		 * */
		{
			url: '/sys/sysUser/verCodePassword',
			method: 'post',
			response: () => {
				return responseResult({
					data: true
				})
			}
		},

		/**
		 * +++++++++++++++++++++++++++++++++++++++++++++++++
		 * 获取登录验证码
		 * +++++++++++++++++++++++++++++++++++++++++++++++++
		 * */
		{
			url: '/getCaptcha',
			method: 'post',
			response: () => {
				return responseResult({
					data: {
						captchaKey: '0l112h',
						base64:
							'data:image/png;base64,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'
					}
				})
			}
		},

		/**
		 * +++++++++++++++++++++++++++++++++++++++++++++++++
		 * 通过userId删除用户
		 * +++++++++++++++++++++++++++++++++++++++++++++++++
		 * */
		{
			url: '/sys/sysUser/delete',
			method: 'post',
			response: ({ body }: Recordable<{ ids: string }>) => {
				try {
					let ids = body.ids.split(',')
					ids.forEach(id => {
						let index = findIndex(users, item => '' + item.userId === id)
						if (index >= 0) {
							users.splice(index, 1)
						}
					})
					return responseResult({
						data: true
					})
				} catch (e) {
					console.error(e)
					return { code: 500 }
				}
			}
		},

		/**
		 * +++++++++++++++++++++++++++++++++++++++++++++++++
		 * 通过userId修改用户状态
		 * +++++++++++++++++++++++++++++++++++++++++++++++++
		 * */
		{
			url: '/sys/sysUser/changeStatus',
			method: 'post',
			response: ({ body }: Recordable<{ userIds: string; status: 1 | 2 }>) => {
				try {
					const ids = body.userIds.split(',')
					ids.forEach(item => {
						let index = findIndex(users, record => '' + record.userId === item)
						if (index >= 0) {
							users[index].status = body.status
						}
					})
					return responseResult({
						data: true
					})
				} catch (e) {
					console.error(e)
					return { code: 500 }
				}
			}
		},

		/**
		 * +++++++++++++++++++++++++++++++++++++++++++++++++
		 * 新增用户
		 * +++++++++++++++++++++++++++++++++++++++++++++++++
		 * */
		{
			url: '/sys/sysUser/add',
			method: 'post',
			response: ({ body }: Recordable<AddUser>) => {
				try {
					users.push({
						account: body.account,
						sex: body.sex,
						realName: body.realName,
						userId: nanoid(),
						phone: body.phone,
						status: 1,
						avatar: body.avatar,
						birthday: body.birthday,
						tenantId: body.tenantId || 1,
						email: body.email,
						name: body.name,
						password: body.password,
						tenantName: '管理组',
						roleIds: ''
					})
					return responseResult({
						data: true
					})
				} catch (e) {
					console.error(e)
					return { code: 500 }
				}
			}
		},

		/**
		 * +++++++++++++++++++++++++++++++++++++++++++++++++
		 * 修改用户
		 * +++++++++++++++++++++++++++++++++++++++++++++++++
		 * */
		{
			url: '/sys/sysUser/edit',
			method: 'post',
			response: ({ body }: Recordable<UpdateUser>) => {
				try {
					const index = findIndex(users, item => item.userId == body.userId)
					if (index >= 0) {
						users[index].name = body.name
						users[index].password = body.password
						users[index].account = body.account
						users[index].realName = body.realName
						users[index].phone = body.phone
						users[index].sex = body.sex
						users[index].birthday = body.birthday
						users[index].email = body.email
						users[index].avatar = body.avatar
						return responseResult({
							message: '修改成功'
						})
					} else {
						return responseResult({
							code: 10086,
							message: '未找到该用户'
						})
					}
				} catch (e) {
					console.error(e)
					return { code: 500 }
				}
			}
		},

		/**
		 * +++++++++++++++++++++++++++++++++++++++++++++++++
		 * 用户授权角色
		 * +++++++++++++++++++++++++++++++++++++++++++++++++
		 * */
		{
			url: '/sys/sysUser/collocationRole',
			method: 'post',
			response: ({ body }: Recordable<{ userId: string | number; roleIds: string }>) => {
				try {
					const index = findIndex(users, item => item.userId == body.userId)
					if (index >= 0) {
						users[index].roleIds = body.roleIds
						return responseResult({
							data: true
						})
					} else {
						return responseResult({
							code: 10086,
							message: `未找到${body.userId}用户`
						})
					}
				} catch (e) {
					return { code: 500 }
				}
			}
		}
	]
}
