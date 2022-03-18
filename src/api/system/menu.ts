import request from '@/utils/request'

/**
 * +++++++++++++++++++++++++++++++++++
 * 类型
 * +++++++++++++++++++++++++++++++++++
 * **/
//菜单列表
export interface AllRouter {
	children?: Array<AllRouter>
	redirect?: string
	menuId: number
	component: string
	path: string
	name: string
	parentId: number
	parentName?: string
	// 1(一级菜单) 2(子类菜单) 3(按钮菜单)
	type: 1 | 2 | 3
	meta: {
		//图标
		menuIcon: string
		//相当于title
		menuName: string
		//是否不在侧边栏显示，1显示 2隐藏
		routeStatus: 1 | 2
		//是否是外链，1是2否
		isOutLinks: 1 | 2
		//排序
		sort: number
		//授权状态 1有效 2无效
		grantStatus?: 1 | 2
		//授权标识
		grantCode?: string
		//1：可见可访问，2：可编辑（未授权时禁用）
		grantType?: 1 | 2
	}
}
//新增菜单
export type AddMenu = Pick<MenuBase, 'assembly' | 'defaultPath' | 'menuIcon' | 'menuName' | 'menuPath' | 'menuType' | 'parentId' | 'routeStatus' | 'sort' | 'grantCode' | 'grantStatus' | 'grantType' | 'isOutLinks' | 'routeName'>

/**
 * +++++++++++++++++++++++++++++++++++
 * 接口
 * +++++++++++++++++++++++++++++++++++
 * **/
// 获取菜单列表
export const getAllMenus: HTTPFunction<AllRouter[]> = () => request({ url: '/sys/sysMenu/menuAllList', method: 'post' })
// 根据角色获取授权菜单id
export const getMenuIdsByRoleId: HTTPFunction<string, { roleIds: string }> = data => request({ url: '/sys/sysRole/roleMenuList', method: 'post', data })
// 新增菜单
export const addMenu: HTTPFunction<boolean> = data => request({ url: '/sys/sysMenu/add', method: 'post', data })
//修改菜单
export const updateMenu: HTTPFunction<boolean> = data => request({ url: '/sys/sysMenu/edit', method: 'post', data })
//删除菜单
export const delMenu: HTTPFunction<boolean, { ids: string }> = data => request({ url: '/sys/sysMenu/delete', method: 'post', data })
