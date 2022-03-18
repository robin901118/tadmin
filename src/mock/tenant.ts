import { responseResult } from './mixin'
import { MockMethod, Recordable } from 'vite-plugin-mock'
import type { TenantItem, AddTenant, UpdateTenant } from '@/api/system/tenant'
import { nanoid } from 'nanoid'
import { cloneDeep, slice, findIndex } from 'lodash'
import dayjs from 'dayjs'

const baseData: Array<TenantItem> = [
	{
		tenantId: 1,
		tenantName: '管理组',
		linkName: 'admin',
		linkPhone: '13118888888',
		accountLimit: -1,
		invalidTime: '不限制',
		status: 1,
		linkAddress: ''
	},
	{
		tenantId: 2,
		tenantName: '财新视野科技有限公司',
		linkName: '张伟军',
		linkPhone: '13832323232',
		accountLimit: 100,
		invalidTime: '2023-12-30 09:00:00',
		status: 1,
		linkAddress: ''
	},
	{
		tenantId: 3,
		tenantName: '东西广告有限公司',
		linkName: '温曲萌',
		linkPhone: '16652525252',
		accountLimit: 80,
		invalidTime: '2024-12-30 09:00:00',
		status: 2,
		linkAddress: ''
	}
]
interface Search extends TableData {
	tenantName: string
	tenantId: number
	linkName: string
}
export default function tenantApis(): Array<MockMethod> {
	return [
		/**
		 * +++++++++++++++++++++++++++++++++++++++++++++++++
		 * 获取所有租户<分页>
		 * +++++++++++++++++++++++++++++++++++++++++++++++++
		 * */
		{
			url: '/sys/sysTenant/list',
			method: 'post',
			response: ({ body }: Recordable<Search>) => {
				let cloneData = cloneDeep(baseData)
				try {
					if (body.tenantId) {
						cloneData = cloneData.filter(item => ('' + item.tenantId).match('' + body.tenantId))
					}

					if (body.tenantName) {
						cloneData = cloneData.filter(item => item.tenantName.match(body.tenantName))
					}

					if (body.linkName) {
						cloneData = cloneData.filter(item => item.linkName.match(body.linkName))
					}

					return responseResult({
						data: {
							list: slice(cloneData, body.page * body.size - body.size, body.size * body.page),
							total: cloneData.length
						}
					})
				} catch (e) {
					console.error(e)
					return responseResult({
						code: 10086,
						message: '参数错误'
					})
				}
			}
		},

		/**
		 * +++++++++++++++++++++++++++++++++++++++++++++++++
		 * 新增租户
		 * +++++++++++++++++++++++++++++++++++++++++++++++++
		 * */
		{
			url: '/sys/sysTenant/add',
			method: 'post',
			response: ({ body }: Recordable<AddTenant>) => {
				let cloneData = cloneDeep(body)
				try {
					const newTenant: TenantItem = {
						tenantId: nanoid(),
						status: 1,
						invalidTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
						accountLimit: -1,
						tenantName: cloneData.tenantName,
						linkName: cloneData.linkName,
						linkPhone: cloneData.linkPhone,
						linkAddress: cloneData.linkAddress
					}
					baseData.push(newTenant)
					return responseResult({
						data: true
					})
				} catch (e) {
					console.error(e)
					return responseResult({
						code: 10086,
						message: '参数错误'
					})
				}
			}
		},

		/**
		 * +++++++++++++++++++++++++++++++++++++++++++++++++
		 * 修改租户
		 * +++++++++++++++++++++++++++++++++++++++++++++++++
		 * */
		{
			url: '/sys/sysTenant/edit',
			method: 'post',
			response: ({ body }: Recordable<UpdateTenant>) => {
				let cloneData: any = cloneDeep(body)
				try {
					const index = findIndex(baseData, item => item.tenantId === body.tenantId)
					if (index !== -1) {
						baseData[index].tenantName = cloneData.tenantName
						baseData[index].linkPhone = cloneData.linkPhone
						baseData[index].linkName = cloneData.linkName
						baseData[index].linkAddress = cloneData.linkAddress
						cloneData.status && (baseData[index].status = cloneData.status)
						return responseResult({
							data: true
						})
					} else {
						return responseResult({
							code: 10086,
							message: `找不到${body.tenantId}的数据`
						})
					}
				} catch (e) {
					console.error(e)
					return responseResult({
						code: 10086,
						message: '参数错误'
					})
				}
			}
		},

		/**
		 * +++++++++++++++++++++++++++++++++++++++++++++++++
		 * 获取所有租户
		 * +++++++++++++++++++++++++++++++++++++++++++++++++
		 * */
		{
			url: '/sys/sysTenant/tenantAllList',
			method: 'post',
			response: () => {
				return responseResult({
					data: baseData
				})
			}
		}
	]
}
