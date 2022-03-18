import { responseResult } from './mixin'
import { MockMethod, Recordable } from 'vite-plugin-mock'
import { nanoid } from 'nanoid'
import dayjs from 'dayjs'
import type { RoleItem, AddRole, UpdateRole } from '@/api/system/role'
import { slice, cloneDeep, findIndex } from 'lodash'
import { menus } from './menu'
import { omitButtonRouter } from '@/utils/router'

//基础数据
const baseData: Array<RoleItem> = [
	{
		roleId: 1,
		roleName: '超级管理员',
		description: '可以使用平台所有功能的角色',
		createTime: '2022-01-01 10:00:00',
		tenantId: nanoid()
	},
	{
		roleId: 2,
		roleName: '测试角色',
		description: '部分功能使用权',
		createTime: '2022-01-01 10:00:00',
		tenantId: nanoid()
	}
]

export default function roleApis(): Array<MockMethod> {
	return [
		/**
		 * +++++++++++++++++++++++++++++++++++++++++++++++++
		 * 获取所有角色
		 * +++++++++++++++++++++++++++++++++++++++++++++++++
		 * */
		{
			url: '/sys/sysRole/list',
			method: 'post',
			timeout: 800,
			response: ({ body }: Recordable) => {
				let cloneData = cloneDeep(baseData)

				if (body.roleName) {
					cloneData = cloneData.filter(item => item.roleName.match(body.roleName))
				}

				return responseResult({
					data: {
						list: slice(cloneData, body.page * body.size - body.size, body.size * body.page),
						total: cloneData.length
					}
				})
			}
		},

		/**
		 * +++++++++++++++++++++++++++++++++++++++++++++++++
		 * 新增角色
		 * +++++++++++++++++++++++++++++++++++++++++++++++++
		 * */
		{
			url: '/sys/sysRole/add',
			method: 'post',
			response: ({ body }: Recordable<AddRole>) => {
				const someDataByName = baseData.filter(item => item.roleName === body.roleName)
				if (someDataByName.length)
					return responseResult({
						code: 10087,
						message: `已存在相同角色名：${body.roleName}`
					})

				//新增
				const newId = nanoid()
				baseData.push({
					roleId: newId,
					roleName: body.roleName,
					description: body.description,
					createTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
					tenantId: body.tenantId
				})

				return responseResult({
					data: newId
				})
			}
		},

		/**
		 * +++++++++++++++++++++++++++++++++++++++++++++++++
		 * 删除角色
		 * +++++++++++++++++++++++++++++++++++++++++++++++++
		 * */
		{
			url: '/sys/sysRole/delete',
			method: 'post',
			response: ({ body }: Recordable<{ ids?: string }>) => {
				try {
					if (!body.ids)
						return responseResult({
							code: 10086,
							message: '缺少id'
						})
					const ids = body.ids.split(',')
					ids.forEach((id: number | string) => {
						const delIndex = findIndex(baseData, item => '' + item.roleId === id)
						if (delIndex !== -1) {
							baseData.splice(delIndex, 1)
						}
					})
					return responseResult({
						data: 'success'
					})
				} catch (e) {
					console.error(e)
					return { code: 500 }
				}
			}
		},

		/**
		 * +++++++++++++++++++++++++++++++++++++++++++++++++
		 * 修改角色
		 * +++++++++++++++++++++++++++++++++++++++++++++++++
		 * */
		{
			url: '/sys/sysRole/edit',
			method: 'post',
			response: ({ body }: Recordable<UpdateRole>) => {
				const itemIndex = findIndex(baseData, item => item.roleId === body.roleId)
				if (itemIndex === -1)
					return responseResult({
						code: 10087,
						message: `找不到${body.roleId}的数据`
					})

				baseData[itemIndex] = {
					...baseData[itemIndex],
					roleName: body.roleName,
					description: body.description
				}

				return responseResult({
					data: baseData[itemIndex]
				})
			}
		},

		/**
		 * +++++++++++++++++++++++++++++++++++++++++++++++++
		 * 租户ID查询对应角色<当前租户下所有角色集合>
		 * +++++++++++++++++++++++++++++++++++++++++++++++++
		 * */
		{
			url: '/sys/sysRole/tenantRoleList',
			method: 'post',
			response: ({ body }: Recordable<{ tenantId?: string | number }>) => {
				return responseResult({
					data: baseData
				})
			}
		},

		/**
		 * +++++++++++++++++++++++++++++++++++++++++++++++++
		 * 角色菜单集合（全部菜单，但是过滤了禁用的按钮）
		 * +++++++++++++++++++++++++++++++++++++++++++++++++
		 * */
		{
			url: '/sys/sysRole/roleMenu',
			method: 'post',
			response: () => {
				return responseResult({
					data: omitButtonRouter(menus)
				})
			}
		}
	]
}
