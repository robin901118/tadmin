import { responseResult } from './mixin'
import { MockMethod, Recordable } from 'vite-plugin-mock'
import { cloneDeep, slice, findIndex } from 'lodash'
import type { TopmenuRecord, AddRecord, UpdateRecord } from '@/api/system/topmenu'
import { menus, delButtonRouter } from './menu'

const baseMenus: Array<TopmenuRecord> = [
	{
		topmenuCode: 'manage',
		topmenuIcon: 'Box',
		topmenuName: '系统管理',
		topmenuId: 1,
		menuIds: '1,18,11,12,13',
		sort: 1
	},
	{
		topmenuCode: 'custom',
		topmenuIcon: 'Coin',
		topmenuName: '自定义组',
		topmenuId: 2,
		menuIds: '11,12',
		sort: 2
	}
]

export default function topmenuApis(): Array<MockMethod> {
	return [
		/**
		 * +++++++++++++++++++++++++++++++++++++++++++++++++
		 * 获取所有顶部菜单
		 * +++++++++++++++++++++++++++++++++++++++++++++++++
		 * */
		{
			url: '/sys/sysTopmenu/list',
			method: 'post',
			response: ({ body }: Recordable<{ page: number; size: number; topmenuCode: string; topmenuName: string }>) => {
				let cloneData = cloneDeep(baseMenus)
				try {
					if (body.topmenuCode) {
						cloneData = cloneData.filter(item => ('' + item.topmenuCode).match('' + body.topmenuCode))
					}
					if (body.topmenuName) {
						cloneData = cloneData.filter(item => ('' + item.topmenuName).match('' + body.topmenuName))
					}
					return responseResult({
						data: {
							list: slice(cloneData, body.page * body.size - body.size, body.size * body.page),
							total: cloneData.length
						}
					})
				} catch (e) {
					console.error(e)
					return { code: 500 }
				}
			}
		},

		/**
		 * +++++++++++++++++++++++++++++++++++++++++++++++++
		 * 添加顶部菜单
		 * +++++++++++++++++++++++++++++++++++++++++++++++++
		 * */
		{
			url: '/sys/sysTopmenu/add',
			method: 'post',
			timeout: 1000,
			response: ({ body }: Recordable<AddRecord>) => {
				try {
					const newRecord: TopmenuRecord = {
						topmenuCode: body.topmenuCode,
						topmenuIcon: body.topmenuIcon,
						topmenuName: body.topmenuName,
						topmenuId: baseMenus.length,
						menuIds: '',
						sort: body.sort
					}
					baseMenus.push(newRecord)
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
		 * 修改顶部菜单
		 * +++++++++++++++++++++++++++++++++++++++++++++++++
		 * */
		{
			url: '/sys/sysTopmenu/edit',
			method: 'post',
			response: ({ body }: Recordable<UpdateRecord>) => {
				try {
					const index = findIndex(baseMenus, item => item.topmenuId == body.topmenuId)
					if (index !== -1) {
						baseMenus[index].topmenuName = body.topmenuName
						baseMenus[index].topmenuIcon = body.topmenuIcon
						baseMenus[index].topmenuCode = body.topmenuCode
						baseMenus[index].sort = body.sort
						return responseResult({
							data: true
						})
					} else {
						return responseResult({
							code: 10086,
							message: `未找到 ${body.topmenuId} 的数据`
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
		 * 删除顶部菜单(单条)
		 * +++++++++++++++++++++++++++++++++++++++++++++++++
		 * */
		{
			url: '/sys/sysTopmenu/delete',
			method: 'post',
			response: ({ body }: Recordable<{ ids: string }>) => {
				try {
					const index = findIndex(baseMenus, item => item.topmenuId == body.ids)
					if (index !== -1) {
						baseMenus.splice(index, 1)
						return responseResult({
							data: true
						})
					} else {
						return responseResult({
							code: 10086,
							message: `未找到 ${body.ids} 的数据`
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
		 * 获取菜单授权
		 * +++++++++++++++++++++++++++++++++++++++++++++++++
		 * */
		{
			url: '/sys/sysTomenuMenu/grantMenu',
			method: 'post',
			response: ({ body }: Recordable<{ topmenuId: number | string; menuIds: string }>) => {
				try {
					const index = findIndex(baseMenus, item => item.topmenuId == body.topmenuId)
					if (index !== -1) {
						baseMenus[index].menuIds = body.menuIds
						return responseResult({
							data: true
						})
					} else {
						return responseResult({
							code: 10086,
							message: `未找到 ${body.topmenuId} 的数据`
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
		 * 根据顶部菜单id获取侧边栏菜单
		 * +++++++++++++++++++++++++++++++++++++++++++++++++
		 * */
		{
			url: '/sys/sysTopmenu/menuList',
			method: 'post',
			response: ({ body }: Recordable<{ topmenuId: string | number }>) => {
				return responseResult({ data: delButtonRouter(menus) })
			}
		}
	]
}
