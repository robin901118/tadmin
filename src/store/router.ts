/**
 * ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
 * 路由状态管理器
 * ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
 * **/
import { router } from '@/router'
import { cloneDeep, findIndex } from 'lodash'

interface RouterHistory {
	title: string
	name: string
	path: string
	closable?: boolean
}

export const useRouterStore = defineStore({
	id: 'router',
	state: () => ({
		//路由历史
		routerHistory: [
			{
				title: '首页',
				name: '/home',
				path: '/home',
				closable: false
			}
		],
		//选中的历史
		activeRouterPath: '/home'
	}),
	actions: {
		//设置选中
		SET_ROUTER_ACTIVE(path: string) {
			this.activeRouterPath = path
		},
		//添加路由历史
		ADD_ROUTER_HISTORY(item: RouterHistory) {
			if (item.path === '/home') return
			const nowPath = item.path.split('?')
			const sameItemIndex = findIndex(this.routerHistory, (row: any) => row.path.split('?')[0] === nowPath[0])
			if (sameItemIndex < 0) {
				this.routerHistory.push(item)
			} else {
				if (nowPath.length > 1) {
					//有query
					this.routerHistory.splice(sameItemIndex, 1) //删除原来的历史
					this.routerHistory.push(item) //添加新历史
				}
			}
		},
		//删除路由历史
		DEL_ROUTER_HISTORY(path: string): void {
			const index = findIndex(this.routerHistory, (item: any) => item.path === path)
			if (index < 0) return
			const item = this.routerHistory[index]
			if (!item.closable) return
			//如果删除的是当前路由的tab
			//则跳转前一个路由
			if (this.activeRouterPath === item.path) {
				router.push(this.routerHistory[index - 1].path)
			}
			this.routerHistory.splice(index, 1)
		},
		//除了自己以外，其他路由全部删除
		DEL_ROUTER_APART_SELF(path: string): void {
			const newRouter = []
			this.routerHistory.forEach(item => {
				if (item.path === path || !item.closable) {
					newRouter.push(cloneDeep(item))
				}
			})
			this.routerHistory = newRouter
			this.activeRouterPath = path
		},
		DEL_ALL_ROUTER() {
			this.$reset()
		}
	}
})
