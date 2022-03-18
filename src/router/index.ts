import type { App } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import type { Router, RouteRecordRaw } from 'vue-router'
import Layout from '@/layout/index.vue'
import notFont from '@/views/404/index.vue'
import NProgress from 'nprogress' // 进度条
import 'nprogress/nprogress.css' // 进度条样式
import { getToken, removeToken } from '@/utils/auth'
import { useUserStore } from '@/store/user'
import { filterAsnycRouter } from './importRoutercom'
import { useRouterStore } from '@/store/router'
import { useAppStore } from '@/store/app'
import { ElNotification } from 'element-plus'

const routes: Array<RouteRecordRaw> = [
	{
		path: '/login',
		name: 'login',
		component: () => import('@/views/login/index.vue'),
		meta: {
			menuName: '登录',
			sort: 1,
			menuIcon: '',
			routeStatus: 2,
			isOutLinks: 2
		}
	},
	{
		path: '/',
		name: 'main',
		component: Layout,
		redirect: '/home',
		children: [
			{
				path: 'home',
				name: 'Home',
				component: () => import('@/views/home/index.vue'),
				meta: {
					menuName: '首页',
					sort: 1,
					menuIcon: '',
					routeStatus: 2,
					isOutLinks: 2
				}
			}
		]
	},
	{
		path: '/user',
		name: 'user',
		component: Layout,
		meta: {
			menuName: '个人中心',
			sort: 1,
			menuIcon: '',
			routeStatus: 2,
			isOutLinks: 2
		},
		redirect: '/user/info',
		children: [
			{
				path: 'info',
				name: 'userInfo',
				component: () => import('@/views/user/info.vue'),
				meta: {
					menuName: '个人资料',
					sort: 1,
					menuIcon: '',
					routeStatus: 2,
					isOutLinks: 2
				}
			}
		]
	},
	{
		path: '/outLink',
		name: 'outLink',
		component: Layout,
		meta: {
			menuName: '外链',
			sort: 3,
			menuIcon: '',
			routeStatus: 2,
			isOutLinks: 2
		},
		redirect: '/outLink/index',
		children: [
			{
				path: 'index',
				name: 'outLinkIndex',
				component: () => import('@/views/outLink/index.vue'),
				meta: {
					menuName: '外链',
					sort: 3,
					menuIcon: '',
					routeStatus: 2,
					isOutLinks: 2
				}
			}
		]
	},
	{
		// path: '/:catchAll(.*)',
		path: '/:path(.*)*',
		name: '404',
		component: notFont,
		meta: {
			menuName: 'not Font',
			sort: 99999999,
			menuIcon: '',
			routeStatus: 2,
			isOutLinks: 2
		}
	}
]
export const router: Router = createRouter({
	history: createWebHistory('/'),
	routes
})

/**
 * +++++++++++++++++++++++++++++++++++
 * 递归添加动态路由
 * +++++++++++++++++++++++++++++++++++
 * **/
function AddRouters(routers: Array<any>, name?: string): Promise<void> {
	return new Promise(resolve => {
		routers.forEach(async (item: any) => {
			if (!item.component) return
			name ? router.addRoute(name, item) : router.addRoute(item)
			if (item.children) {
				await AddRouters(item.children, item.name)
			}
		})
		resolve()
	})
}

export default (app: App) => {
	//设置进度条禁止显示转圈精灵
	NProgress.configure({ showSpinner: false })
	//用户store实例
	const userStore = useUserStore()
	//路由状态管理器
	const routerStore = useRouterStore()
	//app状态管理器
	const appStore = useAppStore()

	/**
	 * ++++++++++++++++++++++++++++++++++++++++++++++++++
	 * 路由守卫
	 * ++++++++++++++++++++++++++++++++++++++++++++++++++
	 * **/
	router.beforeEach(async (to, from, next) => {
		//取消正在进行的请求
		//@ts-ignore
		window.__axiosPromiseArr &&
			//@ts-ignore
			window.__axiosPromiseArr.forEach((ele, idx) => {
				ele.cancel()
				//@ts-ignore
				delete window.__axiosPromiseArr[idx]
			})

		// @ts-expect-error
		document.title = to?.meta?.menuName || '未命名'
		NProgress.start()
		if (getToken()) {
			if (to.path === '/login') {
				next({ path: '/' })
				NProgress.done()
			} else {
				if (userStore.authRoutes.length) {
					if (to.name !== '404' && to.name !== 'login') {
						routerStore.SET_ROUTER_ACTIVE(to.fullPath)
						//添加面包屑，注：v1.4.1修复404页面也会添加的bug
						routerStore.ADD_ROUTER_HISTORY({
							title: '' + to.meta.menuName,
							path: to.fullPath,
							name: to.fullPath,
							closable: true
						})
					}
					next()
				} else {
					try {
						// 获取个人信息和路由菜单
						const authRouters = await userStore.GET_USER_INFO()
						//转换菜单
						const transRouters = filterAsnycRouter(authRouters)
						if (!transRouters?.length) {
							ElNotification({
								title: '错误',
								message: '路由未配置，请联系管理员！',
								type: 'error'
							})
							removeToken()
							next(`/login?redirect=${to.path}`)
							NProgress.done()
						} else {
							//添加路由
							await AddRouters(transRouters)
							//获取侧边栏
							await appStore.GET_SIDE_MENUS()
							next(to.fullPath)
						}
					} catch (e) {
						console.error(e)
						removeToken()
						next(`/login?redirect=${to.path}`)
						NProgress.done()
					}
				}
			}
		} else {
			if (to.path === '/login') {
				next()
			} else {
				next(`/login?redirect=${to.path}`)
				NProgress.done()
			}
		}
	})

	router.afterEach(() => {
		NProgress.done()
	})
	app.use(router)
}
