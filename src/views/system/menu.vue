<template>
	<div>
		<el-card shadow="never">
			<template #header>
				<h5 class="cardTitle">菜单管理</h5>
			</template>
			<div v-auth="'sys:menu:add'">
				<el-button icon="Plus" type="primary" @click="onAdd">新增</el-button>
			</div>
			<!--表格-->
			<el-table :data="tableData" v-loading="requestLoading" style="width: 100%; margin-top: 20px" row-key="menuId">
				<el-table-column label="菜单名称" fixed="left" width="140">
					<template #default="scope">
						{{ scope.row.meta.menuName || '-' }}
					</template>
				</el-table-column>
				<el-table-column label="菜单类型" width="140">
					<template #default="scope">
						<el-tag v-if="scope.row.type === 1">一级菜单</el-tag>
						<el-tag type="warning" v-else-if="scope.row.type === 2">子菜单</el-tag>
						<el-tag type="info" v-else>按钮</el-tag>
					</template>
				</el-table-column>
				<el-table-column label="图标" align="center" width="120">
					<template #default="scope">
						<el-icon v-if="scope.row.meta.menuIcon">
							<component :is="scope.row.meta.menuIcon" />
						</el-icon>
					</template>
				</el-table-column>
				<el-table-column label="组件" prop="component" />
				<el-table-column label="路径" prop="path" />
				<el-table-column label="授权标识" width="150" align="center">
					<template #default="scope">
						<template v-if="scope.row.type === 3">
							<span>{{ scope.row.meta?.grantCode == '0' ? '-' : scope.row.meta.grantCode }}</span>
						</template>
						<span v-else>-</span>
					</template>
				</el-table-column>
				<el-table-column label="按钮状态" align="center">
					<template #default="scope">
						<template v-if="scope.row.type === 3">
							<el-tag :type="scope.row.meta.grantStatus === 1 ? 'success' : 'danger'" v-dict="{ label: 'status', value: scope.row.meta.grantStatus }" />
						</template>
						<span v-else>-</span>
					</template>
				</el-table-column>
				<el-table-column label="排序" align="center" width="120">
					<template #default="scope">
						{{ scope.row.meta.sort }}
					</template>
				</el-table-column>
				<el-table-column label="操作" align="center" width="140">
					<template #default="scope">
						<span v-auth="'sys:menu:edit'">
							<el-button type="text" @click.stop="onEdit(scope.row)">编辑</el-button>
						</span>
						<el-divider direction="vertical" />
						<el-dropdown @command="onClickDropdown($event, scope.row)">
							<el-button type="text">
								更多
								<el-icon class="el-icon--right">
									<arrow-down />
								</el-icon>
							</el-button>
							<template #dropdown>
								<el-dropdown-menu>
									<el-dropdown-item command="detail">详情</el-dropdown-item>
									<span v-if="scope.row.type !== 3" v-auth="'sys:menu:addChild'">
										<el-dropdown-item command="addChild">添加下级</el-dropdown-item>
									</span>
									<span v-auth="'sys:menu:delete'">
										<el-dropdown-item command="delRecord">删除</el-dropdown-item>
									</span>
								</el-dropdown-menu>
							</template>
						</el-dropdown>
					</template>
				</el-table-column>
			</el-table>
			<!--新增、修改弹窗-->
			<add-menu-dialog v-model="addDialogVisible" :menu-data="treeRouters" :open-type="openType" @success="getTableData" ref="menuInfoDialog" />
		</el-card>
	</div>
</template>

<script lang="ts" setup>
import { getAllMenus, delMenu } from '@/api/system/menu'
import type { AllRouter } from '@/api/system/menu'
import addMenuDialog from './addMenuDialog.vue'
import { ElMessageBox, ElMessage } from 'element-plus'
import { omitButtonRouter } from '@/utils/router'
import { cloneDeep } from 'lodash'
import { useUserStore } from '@/store/user'

const requestLoading = ref<boolean>(false)
const tableData = ref<AllRouter[]>([])
const userStore = useUserStore()
//新增弹窗显示隐藏
const addDialogVisible = ref<boolean>(false)
//弹窗实例
const menuInfoDialog = ref()
//是否是添加
const openType = ref<number>(1)
//转换【上级菜单选项】，过滤掉按钮
const treeRouters = computed(() => {
	return omitButtonRouter(cloneDeep(tableData.value))
})

/**
 * +++++++++++++++++++++++++++++++++++++++++
 * 获取菜单数据
 * +++++++++++++++++++++++++++++++++++++++++
 * **/
function getTableData() {
	requestLoading.value = true
	getAllMenus()
		.then(res => {
			tableData.value = res
		})
		.finally(() => {
			requestLoading.value = false
		})
}

/**
 * +++++++++++++++++++++++++++++++++++++++++
 * 新增菜单
 * +++++++++++++++++++++++++++++++++++++++++
 * **/
function onAdd() {
	openType.value = 1
	addDialogVisible.value = true
}

/**
 * +++++++++++++++++++++++++++++++++++++++++
 * 修改菜单
 * +++++++++++++++++++++++++++++++++++++++++
 * **/
function onEdit(item: AllRouter) {
	addDialogVisible.value = true
	openType.value = 2
	backFillData(item)
}

/**
 * +++++++++++++++++++++++++++++++++++++++++
 * 点击更多菜单
 * +++++++++++++++++++++++++++++++++++++++++
 * **/
function onClickDropdown(command: string, item: AllRouter) {
	switch (command) {
		//详情
		case 'detail':
			addDialogVisible.value = true
			openType.value = 3
			backFillData(item)
			break

		//添加下级
		case 'addChild':
			addDialogVisible.value = true
			openType.value = 1
			const formRef = menuInfoDialog.value.form
			formRef.menuType = 2
			setTimeout(() => {
				formRef.parentId = item.menuId
				formRef.parentName = item.meta.menuName
			}, 0)
			break

		//删除
		case 'delRecord':
			ElMessageBox({
				title: '删除',
				message: `您确定要删除 ${item.meta.menuName} 连同其子菜单吗？`,
				showCancelButton: true,
				confirmButtonText: '确定删除',
				cancelButtonText: '取消',
				type: 'warning',
				beforeClose: (action, instance, done) => {
					if (action === 'confirm') {
						instance.confirmButtonLoading = true
						instance.confirmButtonText = '删除中...'
						delMenu({ ids: item.menuId.toString() })
							.then(() => {
								instance.confirmButtonLoading = false
								done()
								nextTick(() => {
									ElMessage({
										type: 'success',
										message: '已删除'
									})
									getTableData()
								})
							})
							.catch(() => {
								instance.confirmButtonLoading = false
								instance.confirmButtonText = '确定删除'
							})
					} else {
						done()
					}
				}
			})
	}
}

/**
 * +++++++++++++++++++++++++++++++++++++++++
 * 回填数据
 * @param item 回填数据
 * +++++++++++++++++++++++++++++++++++++++++
 * **/
function backFillData(item: AllRouter) {
	nextTick(() => {
		const formRef = menuInfoDialog.value.form
		formRef.menuType = item.type
		//避免切换Type的时候回填数据失败
		setTimeout(() => {
			formRef.sort = item.meta.sort
			formRef.routeStatus = item.meta.routeStatus
			formRef.menuName = item.meta.menuName
			formRef.menuPath = item.path
			formRef.routeName = item.name
			formRef.assembly = item.component
			formRef.defaultPath = item.redirect || ''
			formRef.menuIcon = item.meta.menuIcon
			formRef.grantStatus = item.meta.grantStatus
			formRef.grantCode = item.meta.grantCode
			formRef.grantType = item.meta.grantType
			formRef.isOutLinks = item.meta.isOutLinks
			formRef.menuId = item.menuId
			formRef.parentId = item.parentId
			formRef.parentName = item.parentName
		}, 0)
	})
}

//获取列表数据
getTableData()
</script>
