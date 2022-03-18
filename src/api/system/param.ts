import request from '@/utils/request'
/**
 * +++++++++++++++++++++++++++++++++++
 * 类型
 * +++++++++++++++++++++++++++++++++++
 * **/
//业务数据
export type ParamItem = Business
//新增
export type AddBusiness = Pick<Business, 'paramKey' | 'paramName' | 'paramValue' | 'remark'>

/**
 * +++++++++++++++++++++++++++++++++++
 * 接口
 * +++++++++++++++++++++++++++++++++++
 * **/
// 获取业务列表
export const getAllParam: HTTPFunction<ParamItem[]> = data => request({ url: '/sys/sysParam/list', method: 'post', data })
//新增业务
export const addParam: HTTPFunction<boolean, AddBusiness> = data => request({ url: '/sys/sysParam/add', method: 'post', data })
//修改业务
export const updateParam: HTTPFunction<boolean, ParamItem> = data => request({ url: '/sys/sysParam/edit', method: 'post', data })
//删除业务
export const delParam: HTTPFunction<boolean, { ids: string }> = data => request({ url: '/sys/sysParam/delete', method: 'post', data })
