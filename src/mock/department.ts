import { responseResult } from './mixin'
import { MockMethod, Recordable } from 'vite-plugin-mock'
import { nanoid } from 'nanoid'
import { DepartmentData } from '@/api/system/department'

// 基础数据
const baseData: Array<DepartmentData> = [
	{
		id: 1,
		departName: '财新视野科技有限公司',
		departType: '1',
		tel: '0591-8888888',
		fax: '0591-8787878',
		address: '福建省福州市鼓楼区软件园C区88栋',
		sort: 1,
		remark: '一家科技公司',
		parentId: 0,
		children: [
			{
				id: 11,
				departName: '项目核算部',
				departType: '2',
				tel: '0591-8888888',
				fax: '0591-8787878',
				address: '福建省福州市鼓楼区软件园C区88栋',
				sort: 1,
				remark: '部门1',
				parentId: 1
			},
			{
				id: 12,
				departName: '项目研发部',
				departType: '2',
				tel: '0591-8888888',
				fax: '0591-8787878',
				address: '福建省福州市鼓楼区软件园C区88栋',
				sort: 2,
				remark: '部门2',
				parentId: 1,
				children: [
					{
						id: 121,
						departName: '架构部',
						departType: '2',
						tel: '0591-8888888',
						fax: '0591-8787878',
						address: '福建省福州市鼓楼区软件园C区88栋',
						sort: 1,
						remark: '部门2-1',
						parentId: 12
					},
					{
						id: 122,
						departName: '产品部',
						departType: '2',
						tel: '0591-8888888',
						fax: '0591-8787878',
						address: '福建省福州市鼓楼区软件园C区88栋',
						sort: 2,
						remark: '部门2-2',
						parentId: 12,
						children: [
							{
								id: 1222,
								departName: '产品经理',
								departType: '3',
								tel: '0591-8888899',
								fax: '0591-8787866',
								address: '福建省福州市鼓楼区软件园C区88栋5楼',
								sort: 1,
								remark: '岗位1',
								parentId: 122
							}
						]
					}
				]
			}
		]
	},
	{
		id: 2,
		departName: '新南方建材有限公司',
		departType: '1',
		tel: '0591-8888888',
		fax: '0591-8787878',
		address: '福建省福州市鼓楼区软件园C区89栋',
		sort: 2,
		remark: '一家建材公司',
		parentId: 0
	},
	{
		id: 3,
		departName: '东西广告有限公司',
		departType: '1',
		tel: '0591-8888456',
		fax: '0591-878555',
		address: '福建省福州市鼓楼区软件园C区100栋1层',
		sort: 2,
		remark: '一家广告公司',
		parentId: 0,
		children: [
			{
				id: 31,
				departName: '设计',
				departType: '3',
				tel: '0591-8888456',
				fax: '0591-878555',
				address: '福建省福州市鼓楼区软件园C区100栋1层101',
				sort: 1,
				remark: '设计岗位',
				parentId: 3
			}
		]
	}
]

export default function departApis(): Array<MockMethod> {
	return [
		/**
		 * +++++++++++++++++++++++++++++++++++++++++++++++++
		 * 获取所有部门
		 * +++++++++++++++++++++++++++++++++++++++++++++++++
		 * */
		{
			url: '/api/sys/getAllDepart',
			method: 'post',
			response: () => {
				return responseResult({ data: baseData })
			}
		},
		/**
		 * +++++++++++++++++++++++++++++++++++++++++++++++++
		 * 根据id删除部门
		 * +++++++++++++++++++++++++++++++++++++++++++++++++
		 * */
		{
			url: '/api/sys/delDepart',
			method: 'post',
			response: ({ body }: Recordable) => {
				try {
					const ids = body.split(',')
					//递归删除
					function delFun(data: Array<DepartmentData>, id: string | number) {
						for (let i = 0; i < data.length; i++) {
							if (data[i].id == id) {
								data.splice(i, 1)
								break
							}
							data[i]?.children?.length && delFun(data[i].children, id)
						}
					}

					//遍历ids
					ids.forEach((item: string | number) => {
						delFun(baseData, item)
					})
					return responseResult({
						data: 'success'
					})
				} catch (e) {
					console.error(e)
					return responseResult({
						code: 500,
						message: '内部出现错误'
					})
				}
			}
		}
	]
}
