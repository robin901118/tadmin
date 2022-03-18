import type { AllRouter } from '@/api/system/menu'

/**
 * +++++++++++++++++++++++++++++++++++++++++
 * 递归路由，删除按钮路由
 * @param item 路由集合
 * 返回没有按钮的路由集合
 * +++++++++++++++++++++++++++++++++++++++++
 * **/
export function omitButtonRouter(item: Array<AllRouter>) {
	const Items = []
	item.forEach(record => {
		if (record.type === 3) return
		if (record.children && record.children.length) {
			record.children = omitButtonRouter(record.children)
		}
		Items.push(record)
	})
	return Items
}
