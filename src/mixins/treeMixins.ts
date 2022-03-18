/*
 * ++++++++++++++++++++++++++++++++++++++++
 * 通用的树状图混合
 * @params init el 操作的树形对象，vue的Ref选中对象
 * @params init data 树形对象的数据，需要响应式的数据
 * ++++++++++++++++++++++++++++++++++++++++
 * */

export function useTreeMixins(init: { el: any; data: any; defaultLink?: any }) {
	const treeRef = init.el
	const treeData = init.data
	// 父子关联，false->关联  true->不关联
	const nodeNotLink = ref<boolean>(init.defaultLink === undefined ? false : init.defaultLink)

	/**
	 * +++++++++++++++++++++++++++++++++++++++++
	 * 展开树形
	 * @params data 树形对象的数据
	 * @params key id
	 * +++++++++++++++++++++++++++++++++++++++++
	 * **/
	function unFoldAll(data: any, key = 'id') {
		data.forEach((el: any) => {
			treeRef.value.store.nodesMap[el[key]].expanded = true
			el.children && el.children.length > 0 && unFoldAll(el.children, key)
		})
	}

	/**
	 * +++++++++++++++++++++++++++++++++++++++++
	 * 折叠树形
	 * @params data 树形对象的数据
	 * @params key id
	 * +++++++++++++++++++++++++++++++++++++++++
	 * **/
	function collapseAll(data: any, key = 'id') {
		data.forEach((el: any) => {
			treeRef.value.store.nodesMap[el[key]].expanded = false
			el.children && el.children.length > 0 && collapseAll(el.children, key)
		})
	}

	/**
	 * +++++++++++++++++++++++++++++++++++++++++
	 * 全选、取消全选
	 * @params isCheck 是否全选 true->全选  false->取消全选
	 * +++++++++++++++++++++++++++++++++++++++++
	 * **/
	function checkedAll(isCheck: boolean) {
		isCheck ? treeRef.value.setCheckedNodes(treeData.value as any, false) : treeRef.value.setCheckedKeys([])
	}

	return {
		nodeNotLink,
		unFoldAll,
		collapseAll,
		checkedAll
	}
}
