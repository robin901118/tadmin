<!--添加字典弹窗-->
<template>
	<el-dialog v-model="visible" :title="props.isAdd ? '新增字典' : '修改字典'" width="30%" :close-on-click-modal="false" @close="formRef.resetFields()">
		<el-form :model="form" ref="formRef" :rules="rules" label-width="100px">
			<el-form-item label="字典名称" prop="dictName">
				<el-input placeholder="请输入字典名称" v-model="form.dictName" />
			</el-form-item>
			<el-form-item label="字典编码" prop="dictNo">
				<el-input placeholder="请输入字典编码" v-model="form.dictNo" />
			</el-form-item>
			<el-form-item label="描述" prop="dictDesc">
				<el-input placeholder="请输入字典描述" v-model="form.dictDesc" />
			</el-form-item>
		</el-form>
		<template #footer>
			<div class="tadmin-flex tadmin-justify-end">
				<el-button @click="visible = false">取消</el-button>
				<el-button type="primary" @click="onConfirm" :loading="submitLoading">{{ props.isAdd ? '新增' : '修改' }}</el-button>
			</div>
		</template>
	</el-dialog>
</template>

<script lang="ts" setup>
import { ElForm, ElMessage } from 'element-plus'
import { addDict, updateDict } from '@/api/system/dict'
import type { UpdateDict } from '@/api/system/dict'
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
//表单
const form = reactive<UpdateDict>({
	dictName: '',
	dictNo: '',
	dictDesc: '',
	dictId: ''
})
//校验规则
const rules = {
	dictName: [{ required: true, message: '请输入字典名称' }],
	dictNo: [{ required: true, message: '请输入字典编码' }]
}
//按钮loading
const submitLoading = ref<boolean>(false)

/**
 * +++++++++++++++++++++++++++++++++++++++++
 * 点击确定
 * +++++++++++++++++++++++++++++++++++++++++
 * **/
function onConfirm() {
	formRef.value.validate(valid => {
		if (valid) {
			submitLoading.value = true
			props.isAdd ? onAdd() : onUpdate()
		}
	})
}

/**
 * +++++++++++++++++++++++++++++++++++++++++
 * 新增
 * +++++++++++++++++++++++++++++++++++++++++
 * **/
function onAdd() {
	let addForm: any = cloneDeep(toRaw(form))
	addForm = omit(addForm, ['dictId'])
	addDict(addForm)
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
function onUpdate() {
	updateDict(toRaw(form))
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
