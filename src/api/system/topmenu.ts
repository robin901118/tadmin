import request from '@/utils/request'
import type { AllRouter } from '@/api/system/menu'

//查询
export interface Search extends TableData {
	topmenuName: string
	topmenuCode: string
}
//列表格式
export type TopmenuRecord = Pick<TopMenu, 'topmenuCode' | 'topmenuIcon' | 'topmenuId' | 'topmenuName' | 'sort' | 'menuIds'>
//添加列表格式
export type AddRecord = Pick<TopMenu, 'topmenuCode' | 'topmenuIcon' | 'topmenuName' | 'sort'>
//修改列表格式
export type UpdateRecord = Pick<TopMenu, 'topmenuCode' | 'topmenuIcon' | 'topmenuName' | 'sort' | 'topmenuId'>

// 获取顶部菜单列表
export const getTopMenus: HTTPFunction<Search, ListData<TopmenuRecord[]>> = data => request({ url: '/sys/sysTopmenu/list', method: 'post', data })
// 新增顶部菜单
export const addTopMenu: HTTPFunction<boolean, AddRecord> = data => request({ url: '/sys/sysTopmenu/add', method: 'post', data })
//修改顶部菜单
export const updateTopMenu: HTTPFunction<boolean, UpdateRecord> = data => request({ url: '/sys/sysTopmenu/edit', method: 'post', data })
//删除顶部菜单
export const delTopMenu: HTTPFunction<boolean, { ids: string }> = data => request({ url: '/sys/sysTopmenu/delete', method: 'post', data })
//顶部菜单授权
export const authRouter: HTTPFunction<boolean, { topmenuId: number | string; menuIds: string }> = data => request({ url: '/sys/sysTopmenu/grantMenu', method: 'post', data })
//根据顶部菜单id获取侧边栏菜单集合
export const getMenusByTopmenuId: HTTPFunction<AllRouter[], { topmenuId: number | string }> = data => request({ url: '/sys/sysTopmenu/menuList', method: 'post', data })
