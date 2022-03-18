import request from '@/utils/request'
/**
 * +++++++++++++++++++++++++++++++++++
 * 类型
 * +++++++++++++++++++++++++++++++++++
 * **/
//用户列表
export type AllUsers = Pick<UserBase, 'birthday' | 'account' | 'avatar' | 'status' | 'sex' | 'phone' | 'realName' | 'userId' | 'tenantId' | 'email' | 'name' | 'password' | 'tenantName' | 'roleIds'>
//修改用户
export interface UpdateUser extends Pick<UserBase, 'userId' | 'tenantId'> {
	status?: 1 | 2
	roleIds?: string
	account?: string
	avatar?: string
	birthday?: string
	email?: string
	name?: string
	password?: string
	phone?: string
	realName?: string
	sex?: number
}
//新增用户
export type AddUser = Pick<UserBase, 'account' | 'avatar' | 'birthday' | 'email' | 'name' | 'password' | 'phone' | 'realName' | 'sex' | 'tenantId'>
//修改自己的信息
export type UpdateSelfInfo = Pick<UserBase, 'account' | 'avatar' | 'birthday' | 'email' | 'name' | 'phone' | 'realName' | 'sex'>

/**
 * +++++++++++++++++++++++++++++++++++
 * 接口
 * +++++++++++++++++++++++++++++++++++
 * **/
// 获取所有用户列表
export const getAllUsers: HTTPFunction<AllUsers> = data => request({ url: '/sys/sysUser/list', method: 'post', data })
// 删除用户
export const delUserByIds: HTTPFunction<boolean, { ids: string }> = data => request({ url: '/sys/sysUser/delete', method: 'post', data })
// 修改用户
export const updateUser: HTTPFunction<boolean> = data => request({ url: '/sys/sysUser/edit', method: 'post', data })
// 新增用户
export const addUser: HTTPFunction<boolean, AddUser> = data => request({ url: '/sys/sysUser/add', method: 'post', data })
// 授权用户角色
export const updateUserRoles: HTTPFunction<boolean, { userId: string | number; roleIds: string }> = data => request({ url: '/sys/sysUser/collocationRole', method: 'post', data })
// 当前用户修改密码
export const updateUserPsw: HTTPFunction<boolean, { oldPassword: string; newPassword: string }> = data => request({ url: '/sys/sysUser/editPassword', method: 'post', data })
// 初始化密码
export const resetPswByUserId: HTTPFunction<boolean, { userId: string }> = data => request({ url: '/sys/sysUser/initPassword', method: 'post', data })
//批量修改用户状态（启用）
export const userEnable: HTTPFunction<boolean, { userIds: string }> = data => request({ url: '/sys/sysUser/userEnable', method: 'post', data })
//批量修改用户状态（禁用）
export const userDisabled: HTTPFunction<boolean, { userIds: string }> = data => request({ url: '/sys/sysUser/userDisabled', method: 'post', data })
//自己修改自己的资料
export const changeSelfInfo: HTTPFunction<boolean, UpdateSelfInfo> = data => request({ url: '/sys/sysUser/editInfo', method: 'post', data })
