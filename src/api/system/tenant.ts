import request from '@/utils/request'

export type TenantItem = Pick<TenantBase, 'tenantId' | 'tenantName' | 'linkName' | 'linkPhone' | 'accountLimit' | 'invalidTime' | 'linkAddress' | 'status'>
export type AddTenant = Pick<TenantBase, 'tenantName' | 'linkName' | 'linkPhone' | 'linkAddress'>
export interface UpdateTenant extends AddTenant {
	tenantId: number | string
	status?: 1 | 2
}

// 获取所有租户(列表分页)
export const getAllTenant: HTTPFunction<any> = data => request({ url: '/sys/sysTenant/list', method: 'post', data })
//新增租户
export const addTenant: HTTPFunction<boolean, AddTenant> = data => request({ url: '/sys/sysTenant/add', method: 'post', data })
//修改租户
export const updateTenant: HTTPFunction<boolean, UpdateTenant> = data => request({ url: '/sys/sysTenant/edit', method: 'post', data })
// 获取所有租户(下拉框使用)
export const getTenantAllList: HTTPFunction<Array<TenantItem>> = () => request({ url: '/sys/sysTenant/tenantAllList', method: 'post' })
//授权额度
export const authTenantById: HTTPFunction<Array<TenantItem>> = data => request({ url: '/sys/sysTenant/grantPower', method: 'post', data })
//租户状态（启用）
export const tenantEnable: HTTPFunction<boolean, { tenantId: string | number }> = data => request({ url: '/sys/sysTenant/tenantEnable', method: 'post', data })
//租户状态（禁用）
export const tenantDisabled: HTTPFunction<boolean, { tenantId: string | number }> = data => request({ url: '/sys/sysTenant/tenantDisabled', method: 'post', data })
