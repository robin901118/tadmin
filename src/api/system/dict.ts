import request from '@/utils/request'
/**
 * +++++++++++++++++++++++++++++++++++
 * 类型
 * +++++++++++++++++++++++++++++++++++
 * **/
//字典列表
export type Dictionary = Pick<DictBase, 'dictDesc' | 'dictId' | 'createTime' | 'dictName' | 'dictNo'>
export type DictConfigRecord = Pick<DictBase, 'dictId' | 'dictGroupId' | 'groupText' | 'groupValue' | 'groupDescribe' | 'sortOrder' | 'status'>
//字典缓存
export interface CatchDict {
	dictGroupList: {
		[property: string]: Array<{
			dictId: number
			dictGroupId: number
			groupDescribe: string
			groupText: string
			sortOrder: number
			status: 1 | 2
			groupValue: any
		}>
	}
	dictMap: {
		[property: string]: { [property: string]: any }
	}
}
//添加字典
export interface AddDict extends Pick<DictBase, 'dictNo' | 'dictName'> {
	dictDesc?: string
}
//修改字典
export type UpdateDict = Pick<DictBase, 'dictNo' | 'dictName' | 'dictId' | 'dictDesc'>

/**
 * +++++++++++++++++++++++++++++++++++
 * 接口
 * +++++++++++++++++++++++++++++++++++
 * **/
//获取字典列表
export const getDictionary: HTTPFunction<ListData<Dictionary[]>> = data => request({ url: '/sys/sysDict/list', method: 'post', data })
//获取字典缓存
export const getCatchDict: HTTPFunction<CatchDict> = () => request({ url: '/sys/sysDict/listCache', method: 'post' })
//添加字典
export const addDict: HTTPFunction<boolean, AddDict> = data => request({ url: '/sys/sysDict/add', method: 'post', data })
//获取字典配置列表
export const getDictGroup: HTTPFunction<ListData<DictConfigRecord[]>> = data => request({ url: '/sys/sysDictGroup/list', method: 'post', data })
//添加字典配置
export const addGroupDict: HTTPFunction<boolean, DictConfigRecord> = data => request({ url: '/sys/sysDictGroup/add', method: 'post', data })
//删除字典
export const delDictByIds: HTTPFunction<boolean, { ids: string | number }> = data => request({ url: '/sys/sysDict/delete', method: 'post', data })
//删除字典配置
export const delGroupDictByIds: HTTPFunction<boolean, { ids: string }> = data => request({ url: '/sys/sysDictGroup/delete', method: 'post', data })
//修改字典
export const updateDict: HTTPFunction<boolean, AddDict> = data => request({ url: '/sys/sysDict/edit', method: 'post', data })
//修改字典配置
export const updateGroupDict: HTTPFunction<boolean, DictConfigRecord> = data => request({ url: '/sys/sysDictGroup/edit', method: 'post', data })
