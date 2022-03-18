<template>
	<div>
		<el-card shadow="never">
			<template #header>
				<h5 class="cardTitle">用户管理</h5>
			</template>
			<!--查询栏-->
			<el-form :model="searchForm" ref="formRef" label-width="100px">
				<el-row :gutter="20">
					<el-col :span="22">
						<el-row :gutter="20">
							<el-col :xl="6" :lg="8" :md="24" v-if="userStore.isSuper === 1">
								<el-form-item label="所属租户" prop="tenantId">
									<el-select v-model="searchForm.tenantId" placeholder="请选择租户" style="width: 100%">
										<el-option v-for="item in allTenant" :label="item.tenantName" :value="item.tenantId.toString()" :key="item.tenantId" />
									</el-select>
								</el-form-item>
							</el-col>
							<el-col :xl="6" :lg="8" :md="24">
								<el-form-item label="登录账号" prop="account">
									<el-input v-model="searchForm.account" placeholder="请输入查询账号" />
								</el-form-item>
							</el-col>
							<el-col :xl="6" :lg="8" :md="24">
								<el-form-item label="性别" prop="sex">
									<t-dict label="sex" v-model="searchForm.sex" />
								</el-form-item>
							</el-col>
							<el-col :xl="6" :lg="8" :md="24">
								<el-form-item label="真实名字" prop="realName">
									<el-input v-model="searchForm.realName" placeholder="请输入真实名字" />
								</el-form-item>
							</el-col>
							<el-col :xl="6" :lg="8" :md="24">
								<el-form-item label="手机号码" prop="phone">
									<el-input v-model="searchForm.phone" placeholder="请输入手机号码" />
								</el-form-item>
							</el-col>
							<el-col :xl="6" :lg="8" :md="24">
								<el-form-item label="用户状态" prop="status">
									<t-dict label="status" v-model="searchForm.status" />
								</el-form-item>
							</el-col>
						</el-row>
					</el-col>
					<el-col :md="24" :lg="2">
						<el-button type="primary" icon="Search" style="width: 100%" @click="getTableData">查询</el-button>
						<el-button icon="RefreshLeft" style="width: 100%; margin: 20px 0 0 0" @click="onResetSearch">重置</el-button>
					</el-col>
				</el-row>
			</el-form>
			<el-divider></el-divider>
			<!--操作栏-->
			<span v-auth="'sys:user:add'">
				<el-button type="primary" icon="Plus" class="tadmin-align-top tadmin-mr-[0.5em]" @click="onAdd">添加用户</el-button>
			</span>
			<el-dropdown class="tadmin-align-top" v-show="selectedRows.length" v-auth-some="['sys:user:delete', 'sys:user:disabled', 'sys:user:enable']">
				<el-button>
					批量操作
					<el-icon class="el-icon--right">
						<arrow-down />
					</el-icon>
				</el-button>
				<template #dropdown>
					<el-dropdown-menu>
						<span v-auth="'sys:user:delete'">
							<el-dropdown-item icon="Delete" @click="onDel(selectedRows)">删除</el-dropdown-item>
						</span>
						<span v-auth="'sys:user:disabled'">
							<el-dropdown-item icon="Lock" @click="onBatchStatus(2)">禁用</el-dropdown-item>
						</span>
						<span v-auth="'sys:user:enable'">
							<el-dropdown-item icon="Unlock" @click="onBatchStatus(1)">启用</el-dropdown-item>
						</span>
					</el-dropdown-menu>
				</template>
			</el-dropdown>
			<t-info-block class="tadmin-my-20">
				<span class="tadmin-text-14 tadmin-mr-[1em]">
					已选择
					<span class="tadmin-px-[0.5em]" style="color: var(--el-color-primary)">{{ selectedRows.length }}</span>
					项
				</span>
				<el-button type="text" @click="mainTable.$refs.table.clearSelection()" v-show="selectedRows.length">清空</el-button>
			</t-info-block>
			<!--数据表格-->
			<t-table ref="mainTable" :table-props="{ data: tableData, border: true, onSelectionChange: tableSelectionHandle, rowKey: 'userId' }" :pagination-props="{ layout: 'total, sizes, prev, pager, next, jumper', total: tableTotal, hideOnSinglePage: true, onCurrentChange: currentChange, onSizeChange: sizeChangeHandle }" v-loading="requestLoading" :col="tableCols" />
		</el-card>
		<add-user-dialog v-model="addDialogVisible" :type="addDialogType" :tenant-list="allTenant" ref="addRef" @success="getTableData" />

		<!--角色授权弹窗-->
		<el-dialog title="角色授权" v-model="authDialogVisible" width="30%" @close="onCloseAuth">
			<el-select multiple placeholder="请选择授权角色" v-model="authInfo.roles" style="width: 100%">
				<el-option v-for="item in allRoles" :key="item.roleId" :label="item.roleName" :value="item.roleId" />
			</el-select>
			<template #footer>
				<el-button @click="authDialogVisible = false">关闭</el-button>
				<el-button type="primary" @click="onSaveRole" :loading="roleSubLoading">保存</el-button>
			</template>
		</el-dialog>
	</div>
</template>

<script lang="tsx" setup>
import { ElForm, ElMessageBox, ElMessage } from 'element-plus'
import { getAllUsers, delUserByIds, updateUserRoles, resetPswByUserId, userEnable, userDisabled } from '@/api/system/user'
import { getTenantRoleList } from '@/api/system/role'
import addUserDialog from './addUserDialog.vue'
import { useTableMixins } from '@/mixins/tableMixins'
import { isArray } from 'lodash'
import { insertArray } from '@/utils/common'
import { getTenantAllList } from '@/api/system/tenant'
import type { RoleItem } from '@/api/system/role'
import type { TenantItem } from '@/api/system/tenant'
import { useUserStore } from '@/store/user'

const { searchForm, requestLoading, tableData, tableTotal, getTableData, currentChange, sizeChangeHandle, selectedRows, tableSelectionHandle } = useTableMixins({
	requestParams: {
		account: '',
		sex: '',
		realName: '',
		phone: '',
		status: '',
		tenantId: ''
	},
	requestFun: getAllUsers
})
//用户状态
const userStore = useUserStore()
//表单实例
const formRef = ref<InstanceType<typeof ElForm>>()
const baseCols = [
	{ type: 'selection', width: 40, align: 'center', show: true },
	{ label: '登录账号', prop: 'account', show: true },
	{ label: '昵称', prop: 'name', align: 'center', width: 110, show: true },
	{ label: '真实姓名', prop: 'realName', align: 'center', width: 110, show: true },
	{ label: '头像', prop: 'avatar', align: 'center', width: 80, show: true, __slot: scope => <el-image src={scope.row.avatar} fit='cover' style='width: 30px; height: 30px; border-radius: 4px' lazy /> },
	{ label: '性别', prop: 'sex', align: 'center', width: 80, show: true, __slot: scope => <span v-dict={{ label: 'sex', value: scope.row.sex }}></span> },
	{ label: '生日', prop: 'birthday', align: 'center', show: true },
	{ label: '手机号码', prop: 'phone', align: 'center', show: true },
	{ label: '状态', prop: 'status', align: 'center', width: 80, show: true, __slot: scope => scope.row.status && <el-tag type={scope.row.status === 1 ? 'success' : 'danger'} v-dict={{ label: 'status', value: scope.row.status }} /> },
	{
		label: '操作',
		width: 200,
		align: 'center',
		show: true,
		__slot: scope => (
			<div>
				<span v-auth={'sys:user:edit'}>
					<el-button type='text' onClick={() => onEdit(scope)}>
						编辑
					</el-button>
					<el-divider direction='vertical' />
				</span>

				<el-dropdown
					v-slots={{
						dropdown: () => (
							<el-dropdown-menu>
								<el-dropdown-item onClick={() => lookDetails(scope)}>详情</el-dropdown-item>
								<span v-auth={'sys:user:auth'}>
									<el-dropdown-item onClick={() => onAuth(scope)}>授权</el-dropdown-item>
								</span>
								<span v-auth={'sys:user:initPwd'}>
									<el-dropdown-item onClick={() => initializationPwd(scope)}>初始化密码</el-dropdown-item>
								</span>
								{scope.row.status === 1 ? (
									<span v-auth={'sys:user:disabled'}>
										<el-dropdown-item onClick={() => onToggleStatus(scope)}>禁用</el-dropdown-item>
									</span>
								) : (
									<span v-auth={'sys:user:enable'}>
										<el-dropdown-item onClick={() => onToggleStatus(scope)}>启用</el-dropdown-item>
									</span>
								)}
								<span v-auth={'sys:user:delete'}>
									<el-dropdown-item onClick={() => onDel(scope.row.userId)}>删除</el-dropdown-item>
								</span>
							</el-dropdown-menu>
						)
					}}
				>
					<el-button type='text'>
						更多
						<el-icon class='el-icon--right'>
							<arrow-down />
						</el-icon>
					</el-button>
				</el-dropdown>
			</div>
		)
	}
]
const tableCols =
	userStore.isSuper === 1
		? insertArray(baseCols, 7, {
				label: '所属租户',
				width: 200,
				prop: 'tenantName',
				show: true,
				align: 'center'
		  })
		: baseCols
const allTenant = ref<TenantItem[]>([])
//表格实例
const mainTable = ref(null)
//添加、编辑弹窗显示隐藏
const addDialogVisible = ref<boolean>(false)
//新增编辑弹窗类型
const addDialogType = ref<'add' | 'detail' | 'edit'>('add')
//授权弹窗显示隐藏
const authDialogVisible = ref<boolean>(false)
//角色集合
const allRoles = ref<RoleItem[]>([])
//选中的角色集合
const authInfo = reactive({
	roles: [],
	userId: ''
})
//角色弹窗保存按钮loading
const roleSubLoading = ref<boolean>(false)
//添加、编辑、详情弹窗实例
const addRef = ref()

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
 * 查看详情
 * ++++++++++++++++++++++++++++++++++++++++
 * **/
function lookDetails(scope: any) {
	addDialogType.value = 'detail'
	addDialogVisible.value = true
	nextTick(() => {
		for (let item in addRef.value.form) {
			if (scope.row.hasOwnProperty(item)) {
				addRef.value.form[item] = scope.row[item]
			}
		}
	})
}

/**
 * ++++++++++++++++++++++++++++++++++++++++
 * 编辑
 * ++++++++++++++++++++++++++++++++++++++++
 * **/
function onEdit(scope: any) {
	addDialogType.value = 'edit'
	addDialogVisible.value = true
	nextTick(() => {
		for (let item in addRef.value.form) {
			if (scope.row.hasOwnProperty(item)) {
				addRef.value.form[item] = scope.row[item]
			}
		}
	})
}

/**
 * ++++++++++++++++++++++++++++++++++++++++
 * 授权
 * ++++++++++++++++++++++++++++++++++++++++
 * **/
function onAuth(scope: any) {
	authDialogVisible.value = true
	nextTick(() => {
		let ids: any = scope.row.roleIds.split(',')
		if (ids.length === 1 && ids[0] === '') {
			ids = []
		} else {
			ids = ids.map(item => +item)
		}
		authInfo.roles = ids
		authInfo.userId = scope.row.userId
	})
}

/**
 * ++++++++++++++++++++++++++++++++++++++++
 * 添加
 * ++++++++++++++++++++++++++++++++++++++++
 * **/
function onAdd() {
	addDialogType.value = 'add'
	addDialogVisible.value = true
}

/**
 * ++++++++++++++++++++++++++++++++++++++++
 * 切换状态
 * ++++++++++++++++++++++++++++++++++++++++
 * **/
function onToggleStatus(scope: any) {
	let statusTxt = scope.row.status === 1 ? '禁用' : '启用'
	ElMessageBox.confirm(`您确定要 ${statusTxt} 该用户吗?`, '温馨提示', {
		confirmButtonText: '确定',
		cancelButtonText: '取消',
		type: 'info'
	})
		.then(() => {
			return scope.row.status === 1 ? userDisabled({ userIds: scope.row.userId }) : userEnable({ userIds: scope.row.userId })
		})
		.then(() => {
			ElMessage({
				type: 'success',
				message: `${statusTxt} 成功`
			})
			getTableData()
		})
}

/**
 * ++++++++++++++++++++++++++++++++++++++++
 * 批量启用禁用
 * ++++++++++++++++++++++++++++++++++++++++
 * **/
function onBatchStatus(status: 1 | 2) {
	let statusTxt = status === 1 ? '启用' : '禁用'
	ElMessageBox.confirm(`您确定要 ${statusTxt} 这 ${selectedRows.value.length} 位用户吗?`, '温馨提示', {
		confirmButtonText: '确定',
		cancelButtonText: '取消',
		type: 'info'
	})
		.then(() => {
			const userIds = selectedRows.value.map(item => item.userId).join(',')
			return status === 1 ? userEnable({ userIds }) : userDisabled({ userIds })
		})
		.then(() => {
			ElMessage({
				type: 'success',
				message: `${statusTxt} 成功`
			})
			getTableData()
		})
}

/**
 * ++++++++++++++++++++++++++++++++++++++++
 * 删除
 * ++++++++++++++++++++++++++++++++++++++++
 * **/
function onDel(ids: any) {
	let idsCount = 1
	if (isArray(ids)) {
		idsCount = ids.length
		ids = ids.map(item => item.userId).join(',')
	}
	ElMessageBox.confirm(`您确定要删除这 ${idsCount} 条数据吗?`, '温馨提示', {
		confirmButtonText: '确定',
		cancelButtonText: '取消',
		type: 'info'
	})
		.then(() => delUserByIds({ ids }))
		.then(() => {
			ElMessage({
				type: 'success',
				message: '删除成功'
			})
			getTableData()
		})
}

/**
 * ++++++++++++++++++++++++++++++++++++++++
 * 保存用户角色授权
 * ++++++++++++++++++++++++++++++++++++++++
 * **/
function onSaveRole() {
	roleSubLoading.value = true
	updateUserRoles({ userId: authInfo.userId, roleIds: authInfo.roles.join(',') })
		.then(() => {
			ElMessage({
				type: 'success',
				message: '授权成功'
			})
			authDialogVisible.value = false
			getTableData()
		})
		.finally(() => {
			roleSubLoading.value = false
		})
}

/**
 * ++++++++++++++++++++++++++++++++++++++++
 * 关闭授权角色弹窗
 * ++++++++++++++++++++++++++++++++++++++++
 * **/
function onCloseAuth() {
	authInfo.roles = []
	authInfo.userId = ''
}

/**
 * ++++++++++++++++++++++++++++++++++++++++
 * 密码初始化
 * ++++++++++++++++++++++++++++++++++++++++
 * **/
function initializationPwd(item: any) {
	ElMessageBox({
		title: '初始化密码',
		message: `您将为 ${item.row.name} 初始化密码成【123456】吗？`,
		showCancelButton: true,
		confirmButtonText: '确定',
		cancelButtonText: '取消',
		beforeClose: (action, instance, done) => {
			if (action === 'confirm') {
				instance.confirmButtonLoading = true
				resetPswByUserId({ userId: item.row.userId })
					.then(() => {
						ElMessage.success('成功')
						done()
					})
					.finally(() => {
						instance.confirmButtonLoading = false
					})
			} else {
				done()
			}
		}
	})
}

/**
 * ++++++++++++++++++++++++++++++++++++++++
 * 生命周期
 * ++++++++++++++++++++++++++++++++++++++++
 * **/
//获取列表数据
getTableData()
getTenantRoleList({ tenantId: userStore.tenantId }).then(res => {
	allRoles.value = res as RoleItem[]
})
userStore.isSuper === 1 &&
	getTenantAllList().then(res => {
		allTenant.value = res
	})
</script>
