<!-- 新增字典配置弹窗 -->
<template>
	<el-dialog v-model="visible" :title="props.isAdd ? '新增字典配置' : '修改字典配置'" width="30%" :close-on-click-modal="false" @close="formRef.resetFields()">
		<el-form :model="form" label-position="top" ref="formRef" :rules="rules">
			<el-row :gutter="20">
				<el-col :span="12">
					<el-form-item label="名称" prop="groupText">
						<el-input placeholder="请输入名称" v-model="form.groupText" />
					</el-form-item>
				</el-col>
				<el-col :span="12">
					<el-form-item label="数据值" prop="groupValue">
						<el-input placeholder="请输入数据值" v-model="form.groupValue" />
					</el-form-item>
				</el-col>
				<el-col :span="24">
					<el-form-item label="描述" prop="groupDescribe">
						<el-input placeholder="请输入描述" v-model="form.groupDescribe" />
					</el-form-item>
				</el-col>
				<el-col :span="12">
					<el-form-item prop="sortOrder">
						<template #label>
							<div class="tadmin-flex tadmin-items-center">
								<span class="tadmin-mr-5">排序</span>
								<el-tooltip content="值越小越靠前" placement="top">
									<el-icon class="tadmin-cursor-pointer" color="#999999">
										<warning />
									</el-icon>
								</el-tooltip>
							</div>
						</template>
						<el-input-number placeholder="请输入排序" v-model="form.sortOrder" style="width: 100%" />
					</el-form-item>
				</el-col>
				<el-col :span="12">
					<el-form-item label="是否启用" prop="status">
						<t-dict label="status" v-model="form.status" />
					</el-form-item>
				</el-col>
			</el-row>
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
import { addGroupDict, updateGroupDict } from '@/api/system/dict'
import type { DictConfigRecord } from '@/api/system/dict'
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
const form = reactive<DictConfigRecord>({
	dictId: 0,
	dictGroupId: 0,
	groupText: '',
	groupValue: '',
	groupDescribe: '',
	sortOrder: 1,
	status: 1
})
//校验规则
const rules = {
	groupText: [{ required: true, message: '请输入名称' }],
	groupValue: [{ required: true, message: '请输入数据值' }]
}
//提交按钮loading
const submitLoading = ref<boolean>(false)

/**
 * ++++++++++++++++++++++++++++++++++++++++
 * 点击确定
 * ++++++++++++++++++++++++++++++++++++++++
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
 * ++++++++++++++++++++++++++++++++++++++++
 * 修改
 * ++++++++++++++++++++++++++++++++++++++++
 * **/
function onUpdate() {
	updateGroupDict(toRaw(form))
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

/**
 * ++++++++++++++++++++++++++++++++++++++++
 * 新增
 * ++++++++++++++++++++++++++++++++++++++++
 * **/
function onAdd() {
	let addForm: any = cloneDeep(toRaw(form))
	addForm = omit(addForm, ['dictGroupId'])
	addGroupDict(addForm)
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
