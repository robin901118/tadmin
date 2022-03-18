<template>
	<div>
		<el-drawer v-model="visible" :title="props.isAdd ? '添加' : '修改'" :close-on-click-modal="false" @close="onCloseDrawer">
			<el-form label-width="100px" :model="form" :rules="rules" ref="formRef">
				<el-form-item label="菜单名" prop="topmenuName">
					<el-input placeholder="请输入菜单名" v-model="form.topmenuName" />
				</el-form-item>
				<el-form-item label="菜单图标" prop="topmenuIcon">
					<el-popover placement="bottom" title="图标选择" :width="600" trigger="focus" v-model:visible="iconPopVisible">
						<template #reference>
							<el-input v-model="form.topmenuIcon" placeholder="请选择菜单图标" :suffix-icon="iconPopVisible ? 'ArrowUp' : 'ArrowDown'" @focus="iconPopVisible = true" />
						</template>
						<template #default>
							<ul class="tadmin-grid tadmin-grid-cols-20 tadmin-gap-4">
								<li v-for="(item, index) in ElIconModules" :key="index" class="tadmin-bg-lightBlue flexCenter tadmin-cursor-pointer tadmin-h-30 hover:tadmin-bg-999 hover:tadmin-text-white dark:tadmin-bg-darkBlueLight" @click.stop="onChooseIcon(item.name)">
									<el-icon :size="15">
										<component :is="item.name" />
									</el-icon>
								</li>
							</ul>
						</template>
					</el-popover>
				</el-form-item>
				<el-form-item label="菜单编号" prop="topmenuCode">
					<el-input placeholder="请输入菜单编号" v-model="form.topmenuCode" />
				</el-form-item>
				<el-form-item label="排序" prop="sort">
					<el-input-number placeholder="请输入排序" v-model="form.sort" :min="1" controls-position="right" class="tadmin-w-full" />
				</el-form-item>
			</el-form>
			<template #footer>
				<el-button @click="visible = false">取消</el-button>
				<el-button type="primary" v-if="isAdd" @click="onAddHandle" :loading="submitLoading">添加</el-button>
				<el-button type="primary" :loading="submitLoading" v-else @click="onUpdateHandle">修改</el-button>
			</template>
		</el-drawer>
	</div>
</template>

<script lang="ts" setup>
import * as ElIconModules from '@element-plus/icons-vue'
import { addTopMenu, updateTopMenu } from '@/api/system/topmenu'
import { ElForm, ElMessage } from 'element-plus'
import { cloneDeep, omit } from 'lodash'

const props = defineProps({
	modelValue: {
		type: Boolean,
		default: false
	},
	isAdd: {
		type: Boolean,
		default: true
	}
})
const emit = defineEmits(['update:modelValue', 'success'])
//弹窗显示隐藏
const visible = ref<boolean>(false)
//添加表单
const form = reactive({
	topmenuName: '',
	sort: 1,
	topmenuCode: '',
	topmenuIcon: '',
	topmenuId: 0
})
const rules = {
	topmenuName: [{ required: true, message: '请输入菜单名' }],
	topmenuIcon: [{ required: true, message: '请选择菜单图标' }],
	topmenuCode: [{ required: true, message: '请输入菜单编号' }],
	sort: [{ required: true, message: '请输入排序' }]
}
//图标弹窗
const iconPopVisible = ref<boolean>(false)
const formRef = ref<InstanceType<typeof ElForm>>()
const submitLoading = ref<boolean>(false)

/**
 * +++++++++++++++++++++++++++++++++++++++++
 * 选择图标
 * +++++++++++++++++++++++++++++++++++++++++
 * **/
function onChooseIcon(iconName: string) {
	form.topmenuIcon = iconName
	nextTick(() => {
		iconPopVisible.value = false
	})
}

/**
 * +++++++++++++++++++++++++++++++++++++++++
 * 添加
 * +++++++++++++++++++++++++++++++++++++++++
 * **/
function onAddHandle() {
	formRef.value.validate(valid => {
		if (valid) {
			submitLoading.value = true
			let cloneForm: any = cloneDeep(toRaw(form))
			cloneForm = omit(cloneForm, ['topmenuId'])
			addTopMenu(cloneForm)
				.then(() => {
					ElMessage({
						type: 'success',
						message: '添加成功'
					})
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
function onUpdateHandle() {
	formRef.value.validate(valid => {
		if (valid) {
			submitLoading.value = true
			updateTopMenu(toRaw(form))
				.then(() => {
					ElMessage({
						type: 'success',
						message: '修改成功'
					})
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
 * 关闭抽屉
 * +++++++++++++++++++++++++++++++++++++++++
 * **/
function onCloseDrawer() {
	formRef.value.resetFields()
	iconPopVisible.value = false
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
