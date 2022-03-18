export function filterAsnycRouter(asyncRouterMap: Array<any>) {
	const newRouters = []
	asyncRouterMap.forEach((route: any) => {
		if (route.type === 3 || route.meta.isOutLinks === 1) return
		if (route.component === 'Layout') {
			route.component = () => import('@/layout/index.vue')
		} else if (route.component === 'Layout_full') {
			route.component = () => import('@/layout/full.vue')
		} else {
			route.path = `${route.path}`
			const comp = resolveComponent(route.component)
			if (comp === '') return
			route.component = ''
		}
		if (route.children !== null && route.children && route.children.length) {
			route.children = filterAsnycRouter(route.children)
		}
		newRouters.push(route)
	})
	return newRouters
}
const pages = import.meta.glob('../views/**/*.vue')
const resolveComponent = (componentPath: string) => {
	if (!componentPath) return ''
	const importPage = pages[componentPath]
	if (!importPage) {
		console.error(`${componentPath} 不存在`)
		return ''
	} else {
		return importPage
	}
}
