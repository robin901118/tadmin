<template>
	<div>
		<el-card shadow="never">
			<template #header>
				<h5 class="cardTitle">角色管理</h5>
			</template>
			<!--查询栏-->
			<el-form ref="formRef" label-width="100px" :model="searchForm">
				<el-row :gutter="20">
					<el-col :xl="6" :lg="8" :md="24" v-if="userStore.isSuper === 1">
						<el-form-item label="所属租户" prop="tenantId">
							<el-select v-model="searchForm.tenantId" placeholder="请选择租户" clearable style="width: 100%">
								<el-option v-for="item in allTenant" :label="item.tenantName" :value="item.tenantId.toString()" :key="item.tenantId" />
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :xl="6" :lg="8" :md="24">
						<el-form-item label="角色名称" prop="roleName">
							<el-input placeholder="请输入角色名称" v-model="searchForm.roleName" />
						</el-form-item>
					</el-col>
					<el-col :xl="6" :lg="8" :md="24" class="tadmin-text-right lg:tadmin-text-left">
						<el-button type="primary" icon="Search" @click="getTableData">查询</el-button>
						<el-button icon="RefreshLeft" @click="onResetSearch">重置</el-button>
					</el-col>
				</el-row>
			</el-form>
			<el-divider />
			<!--操作栏-->
			<span v-auth="'sys:role:add'">
				<el-button type="primary" icon="Plus" class="tadmin-align-top tadmin-mr-[0.5em]" @click="onAddHandle">添加角色</el-button>
			</span>
			<span v-auth="'sys:role:delete'">
				<el-popconfirm title="是否删掉已选角色?" @confirm="onDelRoleHandle(selectedRows)">
					<template #reference>
						<el-button type="danger" icon="Delete" class="tadmin-align-top tadmin-mr-[0.5em]" v-show="selectedRows.length">删除</el-button>
					</template>
				</el-popconfirm>
			</span>

			<t-info-block class="tadmin-my-20">
				<span class="tadmin-text-14 tadmin-mr-[1em]">
					已选择
					<span class="tadmin-px-[0.5em]" style="color: var(--el-color-primary)">{{ selectedRows.length }}</span>
					项
				</span>
				<el-button type="text" @click="mainTable.clearSelection()" v-show="selectedRows.length">清空</el-button>
			</t-info-block>
			<!--数据表格-->
			<el-table ref="mainTable" :data="tableData" v-loading="requestLoading" border row-key="roleId" class="tadmin-mt-20" @selection-change="tableSelectionHandle">
				<el-table-column type="selection" align="center" />
				<el-table-column label="序号" type="index" width="80px" align="center" />
				<el-table-column label="角色名称" prop="roleName" width="140px" />
				<el-table-column label="角色描述" prop="description" />
				<el-table-column label="创建时间" prop="createTime" align="center" width="180px" />
				<template v-if="userStore.isSuper === 1">
					<el-table-column label="所属租户" prop="tenantName" />
				</template>
				<el-table-column label="操作" align="center" width="200" fixed="right">
					<template #default="scope">
						<span v-auth="'sys:role:edit'">
							<el-button type="text" @click="onEditHandle(scope.row)">编辑</el-button>
						</span>
						<el-divider direction="vertical" />
						<span v-auth="'sys:role:auth'">
							<el-button type="text" @click="onAuth(scope.row.roleId)">授权</el-button>
						</span>
						<el-divider direction="vertical" />
						<span v-auth="'sys:role:delete'">
							<el-popconfirm title="是否删掉这一角色?" @confirm="onDelRoleHandle(scope.row.roleId)">
								<template #reference>
									<el-button type="text">删除</el-button>
								</template>
							</el-popconfirm>
						</span>
					</template>
				</el-table-column>
			</el-table>
			<!--分页-->
			<div class="tadmin-pt-20 tadmin-flex tadmin-justify-end">
				<el-pagination layout="total, sizes, prev, pager, next, jumper" :total="tableTotal" @current-change="currentChange" hide-on-single-page @size-change="sizeChangeHandle" />
			</div>
			<!--添加角色弹窗-->
			<add-role-dialog v-model="addDialogVisible" :tenant-list="allTenant" @success="onResetSearch" ref="addDialog" />
			<!--授权弹窗-->
			<role-auth-drawer v-model="authDrawerVisible" :role-id="authId" @success="onResetSearch" />
		</el-card>
	</div>
</template>

<script lang="ts" setup>
import { useTableMixins } from '@/mixins/tableMixins'
import type { RoleItem } from '@/api/system/role'
import { getAllRoles, delRole } from '@/api/system/role'
import { ElForm, ElMessage, ElTable } from 'element-plus'
import addRoleDialog from './addRoleDialog.vue'
import roleAuthDrawer from './roleAuthDrawer.vue'
import { getTenantAllList } from '@/api/system/tenant'
import { isArray } from 'lodash'
import { useUserStore } from '@/store/user'

const { searchForm, requestLoading, tableData, tableTotal, getTableData, currentChange, sizeChangeHandle, selectedRows, tableSelectionHandle } = useTableMixins({
	requestParams: {
		roleName: '',
		tenantId: ''
	},
	requestFun: getAllRoles
})
//用户状态实例
const userStore = useUserStore()
//表单实例
const formRef = ref<InstanceType<typeof ElForm>>()
//添加、编辑弹窗实例
const addDialog = ref()
//添加、编辑弹窗显示隐藏
const addDialogVisible = ref<boolean>(false)
//授权弹窗显示隐藏
const authDrawerVisible = ref<boolean>(false)
//授权ids
const authId = ref<string>('')
//表格实例
const mainTable = ref<InstanceType<typeof ElTable>>()
//租户集合
const allTenant = ref([])

/**
 * ++++++++++++++++++++++++++++++++++++++++
 * 重置查询条件
 * ++++++++++++++++++++++++++++++++++++++++
 * **/
function onResetSearch() {
	formRef.value.resetFields()
	getTableData()
}

/**
 * ++++++++++++++++++++++++++++++++++++++++
 * 删除角色
 * ++++++++++++++++++++++++++++++++++++++++
 * **/
function onDelRoleHandle(itemId: any) {
	if (isArray(itemId)) {
		itemId = itemId.map(id => id.roleId).join(',')
	}
	delRole({ ids: '' + itemId }).then(res => {
		ElMessage({
			type: 'success',
			message: '删除成功'
		})
		getTableData()
	})
}

/**
 * ++++++++++++++++++++++++++++++++++++++++
 * 新增角色
 * ++++++++++++++++++++++++++++++++++++++++
 * **/
function onAddHandle() {
	addDialog.value.isAdd = true //新增
	addDialogVisible.value = true
}

/**
 * ++++++++++++++++++++++++++++++++++++++++
 * 编辑
 * ++++++++++++++++++++++++++++++++++++++++
 * **/
function onEditHandle(item: RoleItem) {
	addDialog.value.isAdd = false //编辑
	addDialogVisible.value = true
	nextTick(() => {
		addDialog.value.form.roleName = item.roleName
		addDialog.value.form.description = item.description
		addDialog.value.form.roleId = item.roleId
		addDialog.value.form.tenantId = item.tenantId
	})
}

/**
 * ++++++++++++++++++++++++++++++++++++++++
 * 授权
 * ++++++++++++++++++++++++++++++++++++++++
 * **/
function onAuth(id: any) {
	authId.value = '' + id
	authDrawerVisible.value = true
}

getTableData()
//如果是超级用户，需要获取租户集合
userStore.isSuper === 1 &&
	getTenantAllList().then(res => {
		allTenant.value = res
	})
</script>
