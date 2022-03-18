import request from '@/utils/request'
/**
 * +++++++++++++++++++++++++++++++++++
 * 类型
 * +++++++++++++++++++++++++++++++++++
 * **/
//角色单条
export type RoleItem = Pick<RoleBase, 'roleId' | 'roleName' | 'description' | 'tenantId' | 'createTime'>
//新增角色表单
export type AddRole = Pick<RoleBase, 'roleName' | 'description' | 'tenantId'>
//修改角色表单
export interface UpdateRole extends AddRole {
	roleId: string | number
}

/**
 * +++++++++++++++++++++++++++++++++++
 * 接口
 * +++++++++++++++++++++++++++++++++++
 * **/
// 获取所有角色
export const getAllRoles: HTTPFunction<ListData<RoleItem[]>> = data => request({ url: '/sys/sysRole/list', method: 'post', data })
// 新增角色
export const addRole: HTTPFunction<any> = data => request({ url: '/sys/sysRole/add', method: 'post', data })
//删除角色
export const delRole: HTTPFunction<any, { ids: string }> = data => request({ url: '/sys/sysRole/delete', method: 'post', data })
// 更新角色
export const updateRole: HTTPFunction<UpdateRole> = data => request({ url: '/sys/sysRole/edit', method: 'post', data })
// 租户ID查询对应角色<当前租户下所有角色集合>
export const getTenantRoleList: HTTPFunction<RoleItem[], { tenantId?: string | number }> = data => request({ url: '/sys/sysRole/tenantRoleList', method: 'post', data })
//角色授权菜单
export const setAuthMenu: HTTPFunction<boolean, { roleId: string | number; menuIds: string }> = data => request({ url: '/sys/sysRole/collocationMenu', method: 'post', data })
//角色菜单集合（全部菜单，但是过滤了禁用的按钮）
export const roleMenus: HTTPFunction<any> = () => request({ url: '/sys/sysRole/roleMenu', method: 'post' })
