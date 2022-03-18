<template>
	<el-dialog v-model="visible" :title="props.isAdd ? '新增业务' : '修改业务'" width="30%" :close-on-click-modal="false" @close="formRef.resetFields()">
		<el-form :model="form" label-position="top" ref="formRef" :rules="rules">
			<el-form-item label="参数名称" prop="paramKey">
				<el-input placeholder="请输入参数名称" v-model="form.paramKey" />
			</el-form-item>
			<el-form-item label="参数键名" prop="paramName">
				<el-input placeholder="请输入参数键名" v-model="form.paramName" />
			</el-form-item>
			<el-form-item label="参数键值" prop="paramValue">
				<el-input placeholder="请输入参数键值" type="textarea" :row="4" v-model="form.paramValue" />
			</el-form-item>
			<el-form-item label="备注" prop="remark">
				<el-input placeholder="请输入备注" type="textarea" :row="4" v-model="form.remark" />
			</el-form-item>
		</el-form>
		<template #footer>
			<div class="tadmin-flex tadmin-justify-end">
				<el-button @click="visible = false">取消</el-button>
				<el-button type="primary" :loading="submitLoading" v-if="props.isAdd" @click="onAdd">新增</el-button>
				<el-button type="primary" :loading="submitLoading" v-else @click="onUpdate">修改</el-button>
			</div>
		</template>
	</el-dialog>
</template>

<script lang="ts" setup>
import { ElForm, ElMessage } from 'element-plus'
import { addParam, updateParam } from '@/api/system/param'
import { cloneDeep, omit } from 'lodash'

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
//提交按钮loading状态
const submitLoading = ref<boolean>(false)
//表单
const form = reactive({
	paramId: 0,
	paramKey: '',
	paramName: '',
	paramValue: '',
	remark: ''
})
//校验规则
const rules = {
	paramKey: [{ required: true, message: '请输入参数名称' }],
	paramName: [{ required: true, message: '请输入参数键名' }],
	paramValue: [{ required: true, message: '请输入参数键值' }]
}

/**
 * +++++++++++++++++++++++++++++++++++++++++
 * 添加
 * +++++++++++++++++++++++++++++++++++++++++
 * **/
function onAdd() {
	formRef.value.validate(valid => {
		if (valid) {
			submitLoading.value = true
			let addForm: any = cloneDeep(toRaw(form))
			addForm = omit(addForm, ['paramId'])
			addParam(addForm)
				.then(() => {
					ElMessage.success('新增成功')
					emit('success')
					visible.value = false
				})
				.finally(() => {
					submitLoading.value = false
				})
		}
	})
}

/**
 * +++++++++++++++++++++++++++++++++++++++++
 * 修改
 * +++++++++++++++++++++++++++++++++++++++++
 * **/
function onUpdate() {
	formRef.value.validate(valid => {
		if (valid) {
			submitLoading.value = true
			updateParam(toRaw(form))
				.then(() => {
					ElMessage.success('修改成功')
					emit('success')
					visible.value = false
				})
				.finally(() => {
					submitLoading.value = false
				})
		}
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
