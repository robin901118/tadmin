<template>
	<div>
		<el-card shadow="never">
			<template #header>
				<h5 class="cardTitle">租户管理</h5>
			</template>
			<!--查询栏-->
			<el-form :model="searchForm" ref="formRef" label-width="100px">
				<el-row :gutter="20">
					<el-col :xl="6" :lg="12" :md="24">
						<el-form-item label="租户ID" prop="tenantId">
							<el-input v-model="searchForm.tenantId" placeholder="请输入租户ID" />
						</el-form-item>
					</el-col>
					<el-col :xl="6" :lg="12" :md="24">
						<el-form-item label="租户名称" prop="tenantName">
							<el-input v-model="searchForm.tenantName" placeholder="请输入租户名称" />
						</el-form-item>
					</el-col>
					<el-col :xl="6" :lg="12" :md="24">
						<el-form-item label="联系人" prop="linkName">
							<el-input v-model="searchForm.linkName" placeholder="请输入联系人" />
						</el-form-item>
					</el-col>
					<el-col :xl="6" :lg="12" :md="24" class="tadmin-text-left lg:tadmin-text-right">
						<el-button type="primary" icon="Search" @click="getTableData">查询</el-button>
						<el-button icon="RefreshLeft" @click="onReset">重置</el-button>
					</el-col>
				</el-row>
			</el-form>
			<el-divider></el-divider>
			<div v-auth="'sys:tenant:add'">
				<el-button type="primary" icon="Plus" @click="onAdd">新增</el-button>
			</div>
			<!--数据表格-->
			<el-table :data="tableData" v-loading="requestLoading" border row-key="tenantId" class="tadmin-mt-20">
				<el-table-column label="租户ID" prop="tenantId" />
				<el-table-column label="租户名称" prop="tenantName" />
				<el-table-column label="联系人" prop="linkName" align="center" width="110" />
				<el-table-column label="联系电话" prop="linkPhone" align="center" />
				<el-table-column label="账号额度" prop="accountLimit" align="center" width="100">
					<template #default="slot">
						{{ slot.row.accountLimit < 0 ? '不限制' : slot.row.accountLimit }}
					</template>
				</el-table-column>
				<el-table-column label="过期时间" prop="invalidTime" />
				<el-table-column label="状态" align="center" width="80">
					<template #default="scope">
						<el-tag :type="scope.row.status === 1 ? 'success' : 'danger'" v-dict="{ label: 'status', value: scope.row.status }" />
					</template>
				</el-table-column>
				<el-table-column label="操作" align="center" width="240" fixed="right">
					<template #default="scope">
						<template v-if="scope.row.status === 1">
							<span v-auth="'sys:tenant:edit'">
								<el-button type="text" @click="onUpdate(scope.row)">编辑</el-button>
							</span>
							<el-divider direction="vertical" />
							<span v-auth="'sys:tenant:auth'">
								<el-button type="text" @click="onOpenAuthPop(scope.row)">授权配置</el-button>
							</span>
							<el-divider direction="vertical" />
							<span v-auth="'sys:tenant:disabled'">
								<el-button size="small" icon="VideoPause" type="danger" @click="onToggleStatus(scope.row, false)">禁用</el-button>
							</span>
						</template>
						<span v-auth="'sys:tenant:enable'" v-else>
							<el-button size="small" type="success" icon="VideoPlay" @click="onToggleStatus(scope.row, true)">启用</el-button>
						</span>
					</template>
				</el-table-column>
			</el-table>
			<!--分页-->
			<div class="tadmin-pt-20 tadmin-flex tadmin-justify-end">
				<el-pagination layout="total, sizes, prev, pager, next, jumper" :total="tableTotal" @current-change="currentChange" hide-on-single-page @size-change="sizeChangeHandle" />
			</div>
		</el-card>
		<!--授权配置弹窗-->
		<el-dialog v-model="authDialogVisible" width="25%" title="租户授权配置" @close="onResetAuthForm">
			<el-form ref="authFormRef" :model="authForm" label-width="80px" :rules="authRules">
				<el-form-item label="账号额度" prop="accountLimit">
					<el-input-number v-model="authForm.accountLimit" :min="-1" controls-position="right" class="tadmin-flex-1" :disabled="authForm.limitInfinite" />
					<el-checkbox class="tadmin-ml-[1em]" v-model="authForm.limitInfinite" />
					<span class="tadmin-pl-4">不限制</span>
				</el-form-item>
				<el-form-item label="过期时间" prop="invalidTime">
					<el-date-picker v-model="authForm.invalidTime" type="datetime" placeholder="请选择过期时间" class="tadmin-flex-1" format="YYYY-MM-DD HH:mm:ss" value-format="YYYY-MM-DD HH:mm:ss" :disabledDate="setDateTimeDisabled" :disabled="authForm.expireInfinite" />
					<el-checkbox class="tadmin-ml-[1em]" v-model="authForm.expireInfinite" @change="authFormRef.clearValidate()" />
					<span class="tadmin-pl-4">不限制</span>
				</el-form-item>
			</el-form>
			<template #footer>
				<el-button type="primary" @click="onSetAuth" :loading="authSubmitLoading">提交</el-button>
				<el-button @click="authDialogVisible = false">取消</el-button>
			</template>
		</el-dialog>
		<!--添加、编辑弹窗-->
		<add-tenant-dialog v-model="addDialogVisible" :is-add="isAdd" ref="addDialogRef" @success="getTableData()" />
	</div>
</template>

<script lang="ts" setup>
import { useTableMixins } from '@/mixins/tableMixins'
import { getAllTenant, tenantEnable, tenantDisabled } from '@/api/system/tenant'
import type { TenantItem } from '@/api/system/tenant'
import { ElForm, ElMessage } from 'element-plus'
import addTenantDialog from './addTenantDialog.vue'
import dayjs from 'dayjs'
import { cloneDeep, omit } from 'lodash'
import { authTenantById } from '@/api/system/tenant'

//查询表单实例
const formRef = ref<InstanceType<typeof ElForm>>()
const { searchForm, requestLoading, tableData, tableTotal, getTableData, currentChange, sizeChangeHandle, onReset } = useTableMixins({
	requestParams: {
		tenantId: '',
		tenantName: '',
		linkName: ''
	},
	requestFun: getAllTenant
})
//租户授权弹窗
const authDialogVisible = ref<boolean>(false)
const authFormRef = ref<InstanceType<typeof ElForm>>()
const authForm = reactive<any>({
	accountLimit: 0,
	invalidTime: '',
	tenantId: 0,
	//是否不限账号额度
	limitInfinite: false,
	//是否不限过期时间
	expireInfinite: false
})
const authRules = computed(() => {
	const baseRule: any = {
		accountLimit: [
			{ required: true, message: '请输入账号额度' },
			{
				validator: (rule: any, value: any, callback: any) => {
					if (value === 0) return callback(new Error('请输入账号额度'))
					callback()
				},
				trigger: 'blur'
			}
		]
	}
	if (!authForm.expireInfinite) {
		baseRule.invalidTime = [{ required: true, message: '请选择过期时间' }]
	}
	return baseRule
})
//添加、修改弹窗
const addDialogVisible = ref<boolean>(false)
const addDialogRef = ref()
const isAdd = ref<boolean>(true)
//授权弹窗提交按钮loading
const authSubmitLoading = ref<boolean>(false)

/**
 * +++++++++++++++++++++++++++++++++++++++++
 * 设置授权弹窗过期时间的禁用日期（当前日期之前）
 * +++++++++++++++++++++++++++++++++++++++++
 * **/
function setDateTimeDisabled(date: Date) {
	return dayjs(date).isBefore(dayjs(), 'day')
}

/**
 * +++++++++++++++++++++++++++++++++++++++++
 * 打开授权弹窗，回填数据
 * +++++++++++++++++++++++++++++++++++++++++
 * **/
function onOpenAuthPop(item: TenantItem) {
	authDialogVisible.value = true
	nextTick(() => {
		if (item.accountLimit === -1) {
			authForm.limitInfinite = true
		} else {
			authForm.accountLimit = item.accountLimit
		}
		authForm.tenantId = item.tenantId
		authForm.invalidTime = item.invalidTime
	})
}

/**
 * +++++++++++++++++++++++++++++++++++++++++
 * 设置授权
 * +++++++++++++++++++++++++++++++++++++++++
 * **/
function onSetAuth() {
	authFormRef.value.validate(valid => {
		if (valid) {
			authSubmitLoading.value = true
			let submitForm: any = cloneDeep(toRaw(authForm))
			submitForm = omit(submitForm, ['limitInfinite', 'expireInfinite'])
			authTenantById(submitForm)
				.then(() => {
					ElMessage.success('授权成功')
					authDialogVisible.value = false
					getTableData()
				})
				.finally(() => {
					authSubmitLoading.value = false
				})
		}
	})
}

/**
 * +++++++++++++++++++++++++++++++++++++++++
 * 打开新增弹窗
 * +++++++++++++++++++++++++++++++++++++++++
 * **/
function onAdd() {
	addDialogVisible.value = true
	isAdd.value = true
}

/**
 * +++++++++++++++++++++++++++++++++++++++++
 * 打开修改弹窗
 * +++++++++++++++++++++++++++++++++++++++++
 * **/
function onUpdate(item: TenantItem) {
	addDialogVisible.value = true
	isAdd.value = false
	nextTick(() => {
		for (let key in addDialogRef.value.form) {
			item?.[key] && (addDialogRef.value.form[key] = item[key])
		}
	})
}

/**
 * +++++++++++++++++++++++++++++++++++++++++
 * 设置启用禁用
 * @param item 条目
 * @param isOpen 设置启用禁用 boolean
 * +++++++++++++++++++++++++++++++++++++++++
 * **/
async function onToggleStatus(item: any, isOpen: boolean) {
	try {
		const row = cloneDeep(item)
		let msg: string = ''
		if (isOpen) {
			await tenantEnable({ tenantId: row.tenantId })
			msg = '已启用'
		} else {
			await tenantDisabled({ tenantId: row.tenantId })
			msg = '已禁用'
		}
		ElMessage.success(msg)
		getTableData()
	} catch (e) {
		console.error(e)
	}
}

/**
 * +++++++++++++++++++++++++++++++++++++++++
 * 重置授权表单，因为有些字段是额外的，不能调用
 * resetFields
 * +++++++++++++++++++++++++++++++++++++++++
 * **/
function onResetAuthForm() {
	const baseForm = {
		accountLimit: 0,
		invalidTime: '',
		tenantId: 0,
		limitInfinite: false,
		expireInfinite: false
	}
	for (let key in baseForm) {
		authForm[key] = baseForm[key]
	}
	nextTick(() => authFormRef.value.clearValidate())
}

//监听租户授权配置弹窗内的不限制勾选
//不限制过期时间
watch(
	() => authForm.expireInfinite,
	nv => {
		if (nv) {
			authForm.invalidTime = ''
		}
	}
)

//不限制账号数量
watch(
	() => authForm.limitInfinite,
	nv => {
		if (nv) {
			authForm.accountLimit = -1
		} else {
			authForm.accountLimit = 0
		}
	}
)
//获取表格data
getTableData()
</script>
