<template>
	<el-dialog :title="props.isAdd ? '新增' : '修改'" v-model="visible" width="30%" @close="formRef.resetFields()">
		<el-form :model="form" :rules="rules" ref="formRef" label-width="80px">
			<el-form-item label="租户名称" prop="tenantName">
				<el-input placeholder="请输入租户名称" v-model="form.tenantName" />
			</el-form-item>
			<el-form-item label="联系人" prop="linkName">
				<el-input placeholder="请输入联系人" v-model="form.linkName" />
			</el-form-item>
			<el-form-item label="联系电话" prop="linkPhone">
				<el-input placeholder="请输入联系电话" v-model="form.linkPhone" maxlength="11" />
			</el-form-item>
			<el-form-item label="联系地址" prop="linkAddress">
				<el-input placeholder="请输入联系地址" type="textarea" :row="3" v-model="form.linkAddress" />
			</el-form-item>
		</el-form>
		<template #footer>
			<el-button type="primary" @click="onConfirm" :loading="submitLoading">{{ props.isAdd ? '新增' : '修改' }}</el-button>
			<el-button @click="visible = false">取消</el-button>
		</template>
	</el-dialog>
</template>

<script lang="ts" setup>
import { ElForm, ElMessage } from 'element-plus'
import type { UpdateTenant } from '@/api/system/tenant'
import { addTenant, updateTenant } from '@/api/system/tenant'
import { cloneDeep, omit } from 'lodash'
import { isPhone } from '@/utils/common'

const props = defineProps({
	//显示隐藏
	modelValue: {
		type: Boolean,
		default: false
	},
	//是否是添加
	isAdd: {
		type: Boolean,
		default: true
	}
})
const emit = defineEmits(['update:modelValue', 'success'])
//弹窗显示隐藏
const visible = ref<boolean>(false)
//表单实例
const formRef = ref<InstanceType<typeof ElForm>>()
//提交修改按钮loading
const submitLoading = ref<boolean>(false)
//表单
const form = reactive<UpdateTenant>({
	tenantName: '',
	linkName: '',
	linkPhone: '',
	linkAddress: '',
	tenantId: 0
})
const rules = {
	tenantName: [{ required: true, message: '请输入租户名称' }],
	linkName: [{ required: true, message: '请输入联系人' }],
	linkPhone: [
		{ required: true, message: '请输入联系电话' },
		{
			validator: (rule: any, value: any, callback: any) => {
				isPhone(value) ? callback() : callback(new Error('请正确输入联系电话'))
			},
			trigger: 'blur'
		}
	]
}

/**
 * +++++++++++++++++++++++++++++++++++++++++
 * 提交
 * +++++++++++++++++++++++++++++++++++++++++
 * **/
function onConfirm() {
	formRef.value.validate(valid => {
		if (valid) {
			submitLoading.value = true
			props.isAdd ? onAddHandle() : onUpdateHandle()
		}
	})
}

/**
 * +++++++++++++++++++++++++++++++++++++++++
 * 新增
 * +++++++++++++++++++++++++++++++++++++++++
 * **/
function onAddHandle() {
	let addForm: any = cloneDeep(toRaw(form))
	addForm = omit(addForm, ['tenantId'])
	addTenant(addForm)
		.then(() => {
			ElMessage({
				type: 'success',
				message: '新增成功'
			})
			visible.value = false
			emit('success')
		})
		.finally(() => {
			submitLoading.value = false
		})
}

/**
 * +++++++++++++++++++++++++++++++++++++++++
 * 修改
 * +++++++++++++++++++++++++++++++++++++++++
 * **/
function onUpdateHandle() {
	updateTenant(toRaw(form))
		.then(() => {
			ElMessage({
				type: 'success',
				message: '修改成功'
			})
			visible.value = false
			emit('success')
		})
		.finally(() => {
			submitLoading.value = false
		})
}

watch(
	() => visible.value,
	nv => {
		emit('update:modelValue', nv)
	}
)
watch(
	() => props.modelValue,
	nv => {
		visible.value = nv
	},
	{ immediate: true }
)
defineExpose({ form })
</script>
