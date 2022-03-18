import { responseResult } from './mixin'
import { MockMethod, Recordable } from 'vite-plugin-mock'
import { nanoid } from 'nanoid'
import { Dictionary, DictConfigRecord, AddDict, UpdateDict } from '@/api/system/dict'
import { slice, cloneDeep, findIndex } from 'lodash'

const dict: Array<Dictionary> = [
	{
		dictId: 1,
		dictName: '状态',
		dictNo: 'status',
		dictDesc: '所有状态下拉框字典'
	},
	{
		dictId: 2,
		dictName: '性别',
		dictNo: 'sex',
		dictDesc: '系统性别字典'
	},
	{
		dictId: 3,
		dictName: '部门类型',
		dictNo: 'departType',
		dictDesc: '部门类型字典'
	},
	{
		dictId: 4,
		dictName: '用户状态',
		dictNo: 'userStatus',
		dictDesc: '用户管理用户状态'
	},
	{
		dictId: 5,
		dictName: '授权策略',
		dictNo: 'grantType',
		dictDesc: '新增菜单--按钮权限--授权策略'
	},
	{
		dictId: 6,
		dictName: '隐藏路由',
		dictNo: 'routerHidden',
		dictDesc: '新增菜单--隐藏路由'
	}
]

const dictSon: { [property: string]: Array<DictConfigRecord> } = {
	1: [
		{
			dictGroupId: nanoid(),
			dictId: 1,
			groupText: '启用',
			groupValue: 1,
			groupDescribe: '',
			sortOrder: 2,
			status: 1
		},
		{
			dictGroupId: nanoid(),
			dictId: 1,
			groupText: '禁用',
			groupValue: 2,
			groupDescribe: '',
			sortOrder: 3,
			status: 2
		}
	],
	2: [
		{
			dictGroupId: nanoid(),
			dictId: 2,
			groupText: '不限',
			groupValue: 0,
			groupDescribe: '',
			sortOrder: 1,
			status: 1
		},
		{
			dictGroupId: nanoid(),
			dictId: 2,
			groupText: '男',
			groupValue: 1,
			groupDescribe: '',
			sortOrder: 2,
			status: 1
		},
		{
			dictGroupId: nanoid(),
			dictId: 2,
			groupText: '女',
			groupValue: 2,
			groupDescribe: '',
			sortOrder: 3,
			status: 1
		}
	],
	3: [
		{
			dictGroupId: nanoid(),
			dictId: 3,
			groupText: '公司',
			groupValue: 1,
			groupDescribe: '',
			sortOrder: 1,
			status: 1
		},
		{
			dictGroupId: nanoid(),
			dictId: 3,
			groupText: '部门',
			groupValue: 2,
			groupDescribe: '',
			sortOrder: 2,
			status: 1
		},
		{
			dictGroupId: nanoid(),
			dictId: 3,
			groupText: '岗位',
			groupValue: 3,
			groupDescribe: '',
			sortOrder: 3,
			status: 1
		}
	],
	4: [
		{
			dictGroupId: nanoid(),
			dictId: 4,
			groupText: '不限',
			groupValue: 0,
			groupDescribe: '',
			sortOrder: 1,
			status: 1
		},
		{
			dictGroupId: nanoid(),
			dictId: 4,
			groupText: '正常',
			groupValue: 1,
			groupDescribe: '',
			sortOrder: 2,
			status: 1
		},
		{
			dictGroupId: nanoid(),
			dictId: 4,
			groupText: '冻结',
			groupValue: 2,
			groupDescribe: '',
			sortOrder: 3,
			status: 1
		}
	],
	5: [
		{
			dictGroupId: nanoid(),
			dictId: 5,
			groupText: '可见/可访问(授权后可见/可访问)',
			groupValue: 1,
			groupDescribe: '',
			sortOrder: 1,
			status: 1
		},
		{
			dictGroupId: nanoid(),
			dictId: 5,
			groupText: '可编辑(未授权时禁用)',
			groupValue: 2,
			groupDescribe: '',
			sortOrder: 2,
			status: 1
		}
	],
	6: [
		{
			dictGroupId: nanoid(),
			dictId: 6,
			groupText: '隐藏',
			groupValue: 1,
			groupDescribe: '',
			sortOrder: 1,
			status: 1
		},
		{
			dictGroupId: nanoid(),
			dictId: 6,
			groupText: '显示',
			groupValue: 2,
			groupDescribe: '',
			sortOrder: 2,
			status: 1
		}
	]
}

export default function dictApis(): Array<MockMethod> {
	return [
		/**
		 * +++++++++++++++++++++++++++++++++++++++++++++++++
		 * 获取字典列表
		 * +++++++++++++++++++++++++++++++++++++++++++++++++
		 * */
		{
			url: '/sys/sysDict/list',
			method: 'post',
			timeout: 800,
			response: ({ body }: Recordable) => {
				try {
					if (body.size && body.page) {
						let records = []
						if (body.dictName) {
							records = dict.filter(item => item.dictName.match(body.dictName))
						}
						if (body.dictNo) {
							records = dict.filter(item => item.dictNo.match(body.dictNo))
						}

						return responseResult({
							data: {
								list: slice(records.length ? records : dict, body.page * body.size - body.size, body.size * body.page),
								total: dict.length
							}
						})
					} else {
						return responseResult({
							code: 4578,
							message: '请传入size和page'
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
		 * 获取缓存字典
		 * +++++++++++++++++++++++++++++++++++++++++++++++++
		 * */
		{
			url: '/sys/sysDict/listCache',
			method: 'post',
			timeout: 800,
			response: () => {
				try {
					const dictGroupList = {}
					const dictMap = {}
					const cloneData = cloneDeep(dict)
					cloneData.forEach((item: Dictionary) => {
						dictGroupList[item.dictNo] = dictSon[item.dictId]
						dictMap[item.dictNo] = {}
						dictSon[item.dictId].forEach((conf: DictConfigRecord) => {
							const cloneObj = cloneDeep(conf)
							dictMap[item.dictNo][cloneObj.groupValue] = cloneObj.groupText
						})
					})
					return responseResult({
						data: { dictGroupList, dictMap }
					})
				} catch (e) {
					console.error(e)
					return { code: 500 }
				}
			}
		},

		/**
		 * +++++++++++++++++++++++++++++++++++++++++++++++++
		 * 添加字典
		 * +++++++++++++++++++++++++++++++++++++++++++++++++
		 * */
		{
			url: '/sys/sysDict/add',
			method: 'post',
			response: ({ body }: Recordable<AddDict>) => {
				try {
					const cloneData = cloneDeep(body)
					const newObj = {
						dictId: nanoid(),
						dictDesc: cloneData.dictDesc || '',
						dictNo: cloneData.dictNo,
						dictName: cloneData.dictName
					}
					dict.push(newObj)
					return responseResult({
						data: true
					})
				} catch (e) {
					console.error(e)
					return {
						code: 500
					}
				}
			}
		},

		/**
		 * +++++++++++++++++++++++++++++++++++++++++++++++++
		 * 获取字典配置列表
		 * +++++++++++++++++++++++++++++++++++++++++++++++++
		 * */
		{
			url: '/sys/sysDictGroup/list',
			method: 'post',
			response: ({ body }: Recordable<{ page: number; size: number; dictId: number | string }>) => {
				try {
					if (dictSon[body.dictId]) {
						return responseResult({
							data: {
								list: slice(dictSon[body.dictId], body.page * body.size - body.size, body.size * body.page),
								total: dictSon[body.dictId].length
							}
						})
					} else {
						return responseResult({
							data: {
								list: [],
								total: 0
							}
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
		 * 字典组添加
		 * +++++++++++++++++++++++++++++++++++++++++++++++++
		 * */
		{
			url: '/sys/sysDictGroup/add',
			method: 'post',
			response: ({ body }: Recordable<DictConfigRecord>) => {
				try {
					const cloneData = cloneDeep(body)
					cloneData.dictGroupId = nanoid()
					if (!dictSon[cloneData.dictId]) {
						dictSon[cloneData.dictId] = []
					}
					dictSon[cloneData.dictId].push(cloneData)
					return responseResult({
						data: true
					})
				} catch (e) {
					console.error(e)
					return {
						code: 500
					}
				}
			}
		},

		/**
		 * +++++++++++++++++++++++++++++++++++++++++++++++++
		 * 删除字典<单条删除>
		 * +++++++++++++++++++++++++++++++++++++++++++++++++
		 * */
		{
			url: '/sys/sysDict/delete',
			method: 'post',
			response: ({ body }: Recordable<{ ids: string }>) => {
				try {
					const index = findIndex(dict, item => '' + item.dictId === body.ids)
					if (index !== -1) {
						dict.splice(index, 1)
						return responseResult({
							data: true
						})
					} else {
						return responseResult({
							code: 10086,
							message: `找不到dictId：${body.ids}`
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
		 * 删除字典配置<单条删除>
		 * +++++++++++++++++++++++++++++++++++++++++++++++++
		 * */
		{
			url: '/sys/sysDictGroup/delete',
			method: 'post',
			response: ({ body }: Recordable<{ ids: string }>) => {
				try {
					let parentId = ''
					let myId = 0

					for (let key in dictSon) {
						myId = findIndex(dictSon[key], item => '' + item.dictGroupId === body.ids)
						if (myId !== -1) {
							parentId = key
							break
						}
					}
					if (myId !== -1) {
						dictSon[parentId].splice(myId, 1)
						return responseResult({ data: true })
					} else {
						return responseResult({
							code: 10086,
							message: `找不到dictId：${body.ids}`
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
		 * 修改字典
		 * +++++++++++++++++++++++++++++++++++++++++++++++++
		 * */
		{
			url: '/sys/sysDict/edit',
			method: 'post',
			response: ({ body }: Recordable<UpdateDict>) => {
				try {
					const cloneData = cloneDeep(body)
					const index = findIndex(dict, item => item.dictId === body.dictId)
					if (index !== -1) {
						dict[index].dictNo = cloneData.dictNo
						dict[index].dictDesc = cloneData.dictDesc
						dict[index].dictName = cloneData.dictName
						return responseResult({
							data: true
						})
					} else {
						return responseResult({
							code: 10086,
							message: `找不到dictId：${body.dictId}`
						})
					}
				} catch (e) {
					console.error(e)
					return {
						code: 500
					}
				}
			}
		},

		/**
		 * +++++++++++++++++++++++++++++++++++++++++++++++++
		 * 修改字典组配置
		 * +++++++++++++++++++++++++++++++++++++++++++++++++
		 * */
		{
			url: '/sys/sysDictGroup/edit',
			method: 'post',
			response: ({ body }: Recordable<DictConfigRecord>) => {
				try {
					const cloneData = cloneDeep(body)
					const dictRow = dictSon[cloneData.dictId]
					const dictGroup = dictRow.findIndex(item => item.dictGroupId === cloneData.dictGroupId)
					if (dictGroup !== -1) {
						dictRow[dictGroup].groupText = cloneData.groupText
						dictRow[dictGroup].groupValue = cloneData.groupValue
						dictRow[dictGroup].groupDescribe = cloneData.groupDescribe
						dictRow[dictGroup].sortOrder = cloneData.sortOrder
						dictRow[dictGroup].status = cloneData.status
						return responseResult({
							data: true
						})
					} else {
						return responseResult({
							code: 10086,
							message: `找不到dictGroupId：${body.dictGroupId}`
						})
					}
				} catch (e) {
					console.error(e)
					return {
						code: 500
					}
				}
			}
		}
	]
}
