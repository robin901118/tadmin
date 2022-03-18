import { responseResult } from './mixin'
import { MockMethod, Recordable } from 'vite-plugin-mock'
import type { ParamItem, AddBusiness } from '@/api/system/param'
import { findIndex } from 'lodash'

const baseData: Array<ParamItem> = [
	{
		paramId: 1,
		paramKey: 'account.initPassword',
		paramName: '账号初始密码',
		paramValue: '123456',
		remark: '账号初始密码'
	},
	{
		paramId: 2,
		paramKey: 'tenant.default.routeName',
		paramName: '默认菜单集合',
		paramValue: 'depk,flow,kspu',
		remark: '默认菜单集合'
	}
]

export default function paramApis(): Array<MockMethod> {
	return [
		/**
		 * +++++++++++++++++++++++++++++++++++++++++++++++++
		 * 获取所有业务数据
		 * +++++++++++++++++++++++++++++++++++++++++++++++++
		 * */
		{
			url: '/sys/sysParam/list',
			method: 'post',
			response: ({ body }: Recordable) => {
				return responseResult({
					data: {
						list: baseData,
						total: baseData.length
					}
				})
			}
		},

		/**
		 * +++++++++++++++++++++++++++++++++++++++++++++++++
		 * 新增业务
		 * +++++++++++++++++++++++++++++++++++++++++++++++++
		 * */
		{
			url: '/sys/sysParam/add',
			method: 'post',
			response: ({ body }: Recordable<AddBusiness>) => {
				try {
					baseData.push({
						paramId: baseData.length,
						paramKey: body.paramKey,
						paramName: body.paramName,
						paramValue: body.paramValue,
						remark: body.remark
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
		 * 修改业务
		 * +++++++++++++++++++++++++++++++++++++++++++++++++
		 * */
		{
			url: '/sys/sysParam/edit',
			method: 'post',
			response: ({ body }: Recordable<ParamItem>) => {
				try {
					const index = findIndex(baseData, item => item.paramId === body.paramId)
					if (index !== -1) {
						baseData[index].paramName = body.paramName
						baseData[index].paramKey = body.paramKey
						baseData[index].paramValue = body.paramValue
						baseData[index].remark = body.remark
						return responseResult({
							data: true
						})
					} else {
						return responseResult({
							code: 10086,
							message: '未找到改数据'
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
		 * 删除业务
		 * +++++++++++++++++++++++++++++++++++++++++++++++++
		 * */
		{
			url: '/sys/sysParam/delete',
			method: 'post',
			response: ({ body }: Recordable<{ ids: string }>) => {
				try {
					let ids = body.ids.split(',')
					ids.forEach(id => {
						const index = findIndex(baseData, item => item.paramId == id)
						index !== -1 && baseData.splice(index, 1)
					})
					return responseResult({
						data: true
					})
				} catch (e) {
					console.error(e)
					return { code: 500 }
				}
			}
		}
	]
}
