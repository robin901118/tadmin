<template>
	<el-dialog v-model="visible" :title="isAdd ? '新增角色' : '修改角色'" width="30%" :close-on-click-modal="false" @close="formRef.resetFields()">
		<el-form :model="form" label-position="top" ref="formRef" :rules="rules">
			<el-form-item label="角色名称" prop="roleName">
				<el-input placeholder="请输入角色名称" v-model="form.roleName" />
			</el-form-item>
			<template v-if="userStore.isSuper === 1">
				<el-form-item label="所属租户" prop="tenantId">
					<el-select v-model="form.tenantId" placeholder="请选择租户" clearable style="width: 100%">
						<el-option v-for="item in props.tenantList" :label="item.tenantName" :value="item.tenantId" :key="item.tenantId" />
					</el-select>
				</el-form-item>
			</template>
			<el-form-item label="角色描述" prop="description">
				<el-input placeholder="请输入角色描述" type="textarea" :rows="3" v-model="form.description" />
			</el-form-item>
		</el-form>
		<template #footer>
			<div class="tadmin-flex tadmin-justify-end">
				<el-button @click="visible = false">取消</el-button>
				<el-button type="primary" @click="onConfirm">{{ isAdd ? '新增' : '修改' }}</el-button>
			</div>
		</template>
	</el-dialog>
</template>

<script lang="ts" setup>
import { ElForm, ElMessage } from 'element-plus'
import { addRole, updateRole } from '@/api/system/role'
import { cloneDeep, omit } from 'lodash'
import { useUserStore } from '@/store/user'

interface Props {
	modelValue: boolean
	tenantList: any
}

const props = withDefaults(defineProps<Props>(), {
	//显示隐藏
	modelValue: false,
	//租户集合
	tenantList: []
})
const emit = defineEmits(['update:modelValue', 'success'])
//是否新增
const isAdd = ref<boolean>(true)
//弹窗显示隐藏
const visible = ref<boolean>(false)
//表单实例
const formRef = ref<InstanceType<typeof ElForm>>()
//表单
const form = reactive({
	tenantId: '',
	roleName: '',
	description: '',
	roleId: ''
})
//校验规则
const rules = {
	roleName: [{ required: true, message: '请输入角色名称' }]
}
//用户状态
const userStore = useUserStore()

/**
 * +++++++++++++++++++++++++++++++++++
 * 确定
 * +++++++++++++++++++++++++++++++++++
 * **/
function onConfirm() {
	isAdd.value ? onAddHandle() : onUpdateHandle()
}

/**
 * +++++++++++++++++++++++++++++++++++
 * 添加角色
 * +++++++++++++++++++++++++++++++++++
 * **/
function onAddHandle() {
	formRef.value.validate(valid => {
		if (valid) {
			let cloneForm: any = cloneDeep(toRaw(form))
			cloneForm = omit(cloneForm, ['roleId'])
			cloneForm.tenantId = cloneForm.tenantId || userStore.tenantId
			addRole(cloneForm).then(() => {
				ElMessage({
					type: 'success',
					message: '新增成功'
				})
				visible.value = false
				emit('success')
			})
		}
	})
}

/**
 * +++++++++++++++++++++++++++++++++++
 * 修改角色
 * +++++++++++++++++++++++++++++++++++
 * **/
function onUpdateHandle() {
	formRef.value.validate(valid => {
		if (valid) {
			const submitForm: any = cloneDeep(toRaw(form))
			submitForm.tenantId = submitForm.tenantId || userStore.tenantId
			updateRole(submitForm).then(() => {
				ElMessage({
					type: 'success',
					message: '修改成功'
				})
				visible.value = false
				emit('success')
			})
		}
	})
}

watch(
	() => visible.value,
	nv => emit('update:modelValue', nv)
)
watch(
	() => props.modelValue,
	nv => (visible.value = nv),
	{ immediate: true }
)
//抛出form，供父元素使用
defineExpose({ form, isAdd })
</script>
