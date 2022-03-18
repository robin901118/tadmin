<template>
	<el-drawer
		v-model="visible"
		title="角色权限配置"
		@close="
			() => {
				checkedAll(false)
				nodeNotLink = true
			}
		"
	>
		<el-tree :data="treeData" show-checkbox node-key="menuId" :props="{ label: transLabel }" :check-strictly="nodeNotLink" ref="routerTree" default-expand-all />
		<template #footer>
			<div class="flexJustify">
				<el-dropdown>
					<el-button>
						树操作
						<el-icon class="el-icon--right"><arrow-up /></el-icon>
					</el-button>
					<template #dropdown>
						<el-dropdown-menu>
							<el-dropdown-item @click="nodeNotLink = false">父子关联</el-dropdown-item>
							<el-dropdown-item @click="nodeNotLink = true">取消关联</el-dropdown-item>
							<el-dropdown-item @click="checkedAll(true)">全部选择</el-dropdown-item>
							<el-dropdown-item @click="checkedAll(false)">取消全选</el-dropdown-item>
							<el-dropdown-item @click="unFoldAll(treeData, 'menuId')">展开所有</el-dropdown-item>
							<el-dropdown-item @click="collapseAll(treeData, 'menuId')">折叠所有</el-dropdown-item>
						</el-dropdown-menu>
					</template>
				</el-dropdown>
				<div>
					<el-button @click="visible = false">取消</el-button>
					<el-button type="primary" @click="onAuth" :loading="authSaveLoading">保存并关闭</el-button>
				</div>
			</div>
		</template>
	</el-drawer>
</template>

<script lang="ts" setup>
import { getMenuIdsByRoleId } from '@/api/system/menu'
import type { AllRouter } from '@/api/system/menu'
import { ElTree, ElMessage } from 'element-plus'
import { useTreeMixins } from '@/mixins/treeMixins'
import { setAuthMenu, roleMenus } from '@/api/system/role'

const props = defineProps({
	//显示隐藏
	modelValue: {
		type: Boolean,
		default: false
	},
	//角色id
	roleId: {
		type: String,
		default: ''
	}
})
const emit = defineEmits(['update:modelValue', 'success'])
const treeData = ref<AllRouter[]>([])
const routerTree = ref<InstanceType<typeof ElTree>>()

//弹窗显示隐藏
const visible = ref<boolean>(false)
//新增、编辑字典值配置弹窗
const addDictConfigDialogVisible = ref<boolean>(false)
// 树形操作
const { nodeNotLink, unFoldAll, collapseAll, checkedAll } = useTreeMixins({
	el: routerTree,
	data: treeData,
	defaultLink: true
})
//授权保存按钮loading
const authSaveLoading = ref<boolean>(false)

/**
 * +++++++++++++++++++++++++++++++++++++++++
 * 转换树形结构的label
 * +++++++++++++++++++++++++++++++++++++++++
 * **/
function transLabel(data: any) {
	return data?.meta?.menuName || '未知'
}

/**
 * +++++++++++++++++++++++++++++++++++++++++
 * 根据角色id勾选菜单树
 * +++++++++++++++++++++++++++++++++++++++++
 * **/
function chooseTreeById() {
	getMenuIdsByRoleId({ roleIds: props.roleId }).then((res: any) => {
		routerTree.value.setCheckedKeys(res)
	})
}

/**
 * +++++++++++++++++++++++++++++++++++++++++
 * 授权
 * +++++++++++++++++++++++++++++++++++++++++
 * **/
function onAuth() {
	const checkedRows = routerTree.value.getCheckedNodes()
	let ids: any = []
	checkedRows.forEach(record => {
		record.parentId && ids.push(record.parentId)
		ids.push(record.menuId)
	})
	ids = [...new Set(ids)].join(',')
	authSaveLoading.value = true
	setAuthMenu({ menuIds: ids, roleId: props.roleId })
		.then(() => {
			visible.value = false
			ElMessage.success('授权成功')
			emit('success')
		})
		.finally(() => {
			authSaveLoading.value = false
		})
}

//获取路由数
roleMenus().then(res => {
	treeData.value = res
})
watch(
	() => visible.value,
	nv => emit('update:modelValue', nv)
)
watch(
	() => props.modelValue,
	nv => {
		visible.value = nv
		nv && chooseTreeById()
	},
	{ immediate: true }
)
</script>
