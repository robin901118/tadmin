import { responseResult } from './mixin'
import { MockMethod, Recordable } from 'vite-plugin-mock'
import type { AllRouter } from '@/api/system/menu'
import { random, cloneDeep } from 'lodash'

export const menus: Array<AllRouter> = [
	{
		menuId: 1,
		path: '/system',
		name: 'system',
		component: 'Layout',
		redirect: '/system/menu',
		meta: {
			menuIcon: 'Odometer',
			menuName: '权限管理',
			routeStatus: 1,
			isOutLinks: 2,
			sort: 1
		},
		type: 1,
		parentId: 0,
		children: [
			{
				path: 'topMenu',
				name: 'topMenuManage',
				component: '../views/system/topMenu.vue',
				menuId: 18,
				parentId: 1,
				type: 2,
				meta: {
					menuName: '菜单分类',
					menuIcon: 'Place',
					routeStatus: 1,
					isOutLinks: 2,
					sort: 10
				},
				children: []
			},
			{
				path: 'menu',
				name: 'menuManage',
				component: '../views/system/menu.vue',
				menuId: 11,
				parentId: 1,
				type: 2,
				meta: {
					menuName: '菜单管理',
					menuIcon: '',
					routeStatus: 1,
					isOutLinks: 2,
					sort: 2
				},
				children: []
			},
			{
				path: 'user',
				name: 'userManage',
				component: '../views/system/user.vue',
				menuId: 12,
				parentId: 1,
				type: 2,
				meta: {
					menuName: '用户管理',
					menuIcon: '',
					routeStatus: 1,
					isOutLinks: 2,
					sort: 3
				},
				children: []
			},
			{
				path: 'dictionary',
				name: 'dictManage',
				component: '../views/system/dictionary.vue',
				menuId: 13,
				parentId: 1,
				type: 2,
				meta: {
					menuName: '数据字典',
					menuIcon: '',
					routeStatus: 1,
					isOutLinks: 2,
					sort: 4
				},
				children: []
			},
			{
				path: 'role',
				name: 'role',
				component: '../views/system/role.vue',
				parentId: 1,
				menuId: 14,
				type: 2,
				meta: {
					menuName: '角色管理',
					menuIcon: '',
					isOutLinks: 2,
					routeStatus: 1,
					sort: 5
				},
				children: []
			},
			{
				path: 'tenant',
				name: 'tenant',
				component: '../views/system/tenant.vue',
				parentId: 1,
				menuId: 16,
				type: 2,
				meta: {
					menuName: '租户管理',
					menuIcon: '',
					isOutLinks: 2,
					routeStatus: 1,
					sort: 6
				},
				children: []
			},
			{
				path: 'param',
				name: 'param',
				component: '../views/system/param.vue',
				parentId: 1,
				menuId: 58,
				type: 2,
				meta: {
					menuName: '业务管理',
					menuIcon: '',
					isOutLinks: 2,
					routeStatus: 1,
					sort: 10
				},
				children: []
			},
			{
				path: 'task',
				name: 'task',
				component: '../views/system/task.vue',
				parentId: 1,
				menuId: 17,
				type: 2,
				meta: {
					menuName: '任务管理',
					menuIcon: '',
					isOutLinks: 2,
					routeStatus: 1,
					sort: 7
				},
				children: []
			},
			{
				path: 'log',
				name: 'log',
				component: '../views/system/log.vue',
				parentId: 1,
				menuId: 19,
				type: 2,
				meta: {
					menuName: '日志管理',
					menuIcon: '',
					routeStatus: 1,
					isOutLinks: 2,
					sort: 8
				},
				children: []
			}
		]
	}
]

export function delButtonRouter(item: AllRouter[]) {
	item = cloneDeep(item)
	const recordArr = []
	item.forEach(record => {
		if (record.type !== 3) {
			if (record.children && record.children.length) {
				record.children = delButtonRouter(record.children)
			}
			recordArr.push(record)
		}
	})
	return recordArr
}

export default function menuApis(): Array<MockMethod> {
	return [
		/**
		 * +++++++++++++++++++++++++++++++++++++++++++++++++
		 * 获取菜单列表数据
		 * +++++++++++++++++++++++++++++++++++++++++++++++++
		 * */
		{
			url: '/sys/sysMenu/menuAllList',
			method: 'post',
			timeout: 1000,
			response: () => {
				return responseResult({
					data: menus
				})
			}
		},

		/**
		 * +++++++++++++++++++++++++++++++++++++++++++++++++
		 * 根据角色id获取已经授权的菜单id进行回填
		 * +++++++++++++++++++++++++++++++++++++++++++++++++
		 * */
		{
			url: '/sys/sysRole/roleMenuList',
			method: 'post',
			response: ({ body }: Recordable<{ roleIds: string }>) => {
				try {
					if (body.roleIds === '1') {
						return responseResult({
							data: '1'
						})
					} else {
						return responseResult({
							data: '11,12'
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
		 * 根据角色id获取已经授权的菜单id进行回填
		 * +++++++++++++++++++++++++++++++++++++++++++++++++
		 * */
		{
			url: '/sys/sysMenu/add',
			method: 'post',
			response: ({ body }: Recordable) => {
				try {
					const nowRecord: AllRouter = {
						path: body.menuPath,
						name: body.routeName,
						component: body.assembly,
						menuId: random(0, 9999999),
						type: body.menuType,
						parentId: body.parentId,
						meta: {
							menuName: body.menuName,
							menuIcon: body.menuIcon,
							routeStatus: body.routeStatus,
							isOutLinks: body.isOutLinks,
							sort: body.sort
						},
						children: []
					}

					function addRecord(item: AllRouter[], parentId: number) {
						for (let i = 0; i < item.length; i++) {
							if (item[i]?.children) {
								if (item[i].menuId == parentId) {
									item[i].children.push(nowRecord)
								} else {
									addRecord(item[i].children, parentId)
								}
							}
						}
					}

					if (body.parentId === 0) {
						menus.push(nowRecord)
					} else {
						addRecord(menus, body.parentId)
					}
					return responseResult({
						data: true
					})
				} catch (e) {
					console.error(e)
					return { code: 500 }
				}
			}
		}
	]
}
