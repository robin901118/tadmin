<!--添加、编辑菜单弹窗-->
<template>
	<el-dialog v-model="visible" :title="transTitle" width="50%" :close-on-click-modal="false" @close="onResetForm">
		<el-form ref="formRef" :model="form" label-width="120px" label-position="top" :rules="rules" :disabled="props.openType === 3">
			<el-row :gutter="20">
				<el-col :span="24">
					<el-form-item label="菜单类型">
						<el-radio-group v-model="form.menuType" :disabled="props.openType === 2" @change="onResetOtherForm">
							<el-radio-button :label="1" :value="1">一级菜单</el-radio-button>
							<el-radio-button :label="2" :value="2">子菜单</el-radio-button>
							<el-radio-button :label="3" :value="3">按钮/权限</el-radio-button>
						</el-radio-group>
					</el-form-item>
				</el-col>
				<template v-if="form.menuType === 3">
					<el-col :span="8">
						<el-form-item label="按钮名称" prop="menuName">
							<el-input v-model="form.menuName" placeholder="请输入按钮名称" />
						</el-form-item>
					</el-col>
				</template>
				<template v-else>
					<el-col :span="8">
						<el-form-item label="隐藏路由" prop="routeStatus">
							<el-select v-model="form.routeStatus" class="tadmin-w-full">
								<el-option label="显示" :value="1" />
								<el-option label="隐藏" :value="2" />
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="是否是外链" prop="isOutLinks">
							<el-select v-model="form.isOutLinks" class="tadmin-w-full">
								<el-option label="是" :value="1" />
								<el-option label="否" :value="2" />
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="排序" prop="sort">
							<el-input-number v-model="form.sort" placeholder="请输入排序" :min="1" style="width: 100%" />
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="菜单名称" prop="menuName">
							<el-input v-model="form.menuName" placeholder="请输入菜单名称" />
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="菜单路径" prop="menuPath">
							<el-input v-model="form.menuPath" placeholder="请输入菜单路径" />
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="路由名称" prop="routeName">
							<el-input v-model="form.routeName" placeholder="请输入路由名称" />
						</el-form-item>
					</el-col>
					<el-col :span="8" v-if="form.isOutLinks === 2">
						<el-form-item label="前端组件" prop="assembly">
							<el-input v-model="form.assembly" placeholder="请输入前端组件" />
						</el-form-item>
					</el-col>
				</template>
				<el-col :span="8" v-if="form.menuType === 1 && form.isOutLinks === 2">
					<el-form-item label="默认跳转地址" prop="defaultPath">
						<el-input v-model="form.defaultPath" placeholder="请输入默认跳转地址" />
					</el-form-item>
				</el-col>
				<el-col :span="8" v-if="form.menuType !== 1">
					<el-form-item label="上级菜单" prop="parentName">
						<el-select v-model="form.parentName" style="width: 100%">
							<el-option :value="form.parentId" style="height: auto">
								<el-tree :data="props.menuData" :render-after-expand="false" :default-expand-all="true" node-key="menuId" @node-click="menuTreeNodeSelect" :props="{ label: transLabel }" />
							</el-option>
						</el-select>
					</el-form-item>
				</el-col>
				<template v-if="form.menuType === 3">
					<el-col :span="8">
						<el-form-item label="菜单路径" prop="menuPath">
							<el-input v-model="form.menuPath" placeholder="请输入菜单路径" />
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="授权标识" prop="grantCode">
							<el-input v-model="form.grantCode" placeholder="请输入授权标识，如：user:list" />
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="授权状态" prop="grantStatus">
							<el-select v-model="form.grantStatus" placeholder="请选择授权状态" style="width: 100%">
								<el-option :value="1" label="启用" />
								<el-option :value="2" label="禁用" />
							</el-select>
						</el-form-item>
					</el-col>
				</template>
				<template v-else>
					<el-col :span="8">
						<el-form-item label="菜单图标" prop="menuIcon">
							<el-popover placement="top" title="图标选择" :width="1000" trigger="focus" v-model:visible="iconPopVisible">
								<template #reference>
									<el-input v-model="form.menuIcon" placeholder="请选择菜单图标" :suffix-icon="iconPopVisible ? 'ArrowUp' : 'ArrowDown'" @focus="iconPopVisible = true" @blur="iconPopVisible = false" />
								</template>
								<template #default>
									<ul class="tadmin-grid tadmin-grid-cols-30 tadmin-gap-4">
										<li v-for="(item, index) in ElIconModules" :key="index" class="tadmin-bg-lightBlue flexCenter tadmin-cursor-pointer tadmin-h-30 hover:tadmin-bg-999 hover:tadmin-text-white dark:tadmin-bg-darkBlueLight" @click.stop="onChooseIcon(item.name)">
											<el-icon :size="15">
												<component :is="item.name" />
											</el-icon>
										</li>
									</ul>
								</template>
							</el-popover>
						</el-form-item>
					</el-col>
				</template>
			</el-row>
		</el-form>
		<template #footer>
			<div class="tadmin-flex tadmin-justify-end">
				<el-button @click="visible = false">取消</el-button>
				<el-button type="primary" @click="onAddHandle" v-if="props.openType === 1" :loading="submitLoading">新增</el-button>
				<el-button type="primary" v-else-if="props.openType === 2" :loading="submitLoading" @click="onUpdateHandle">修改</el-button>
			</div>
		</template>
	</el-dialog>
</template>

<script lang="ts" setup>
import { ElForm, ElMessage } from 'element-plus'
import * as ElIconModules from '@element-plus/icons-vue'
import type { AllRouter } from '@/api/system/menu'
import { addMenu, updateMenu } from '@/api/system/menu'
import { cloneDeep, omit } from 'lodash'

const props = defineProps({
	//显示隐藏
	modelValue: {
		type: Boolean,
		default: false
	},
	//是否添加
	openType: {
		type: Number,
		default: 1
	},
	//所有菜单数据
	menuData: {
		type: Array,
		default: () => []
	}
})
const emit = defineEmits(['update:modelValue', 'success'])
//弹窗显示隐藏
const visible = ref<boolean>(false)
//表单实例
const formRef = ref<InstanceType<typeof ElForm>>()
//图标弹窗显示隐藏
const iconPopVisible = ref<boolean>(false)
//form表单
const form = reactive({
	menuId: 0,
	menuType: 1,
	routeStatus: 1,
	sort: 1,
	menuName: '',
	menuPath: '',
	assembly: '',
	defaultPath: '',
	parentId: 0,
	parentName: '',
	grantStatus: 1,
	grantType: 1,
	grantCode: '',
	menuIcon: '',
	routeName: '',
	isOutLinks: 2
})
//校验规则
const rules = computed(() => {
	const baseRules: any = {
		menuName: [{ required: true, message: '请输入菜单名称' }],
		routeName: [{ required: true, message: '请输入路由名称' }],
		menuPath: [{ required: true, message: '请输入菜单路径' }],
		assembly: [
			{ required: true, message: '请输入前端组件' },
			{
				validator: (rule: any, value: any, callback: any) => {
					if (value === 'Layout' || value === 'Layout_full' || /^..\/views\/+(.)+\.vue$/.test(value)) return callback()
					return callback(new Error('前端组件格式填写错误，示例：../views/aa/bb.vue 或者 Layout 或者Layout_full'))
				},
				trigger: 'blur'
			}
		]
	}

	//切换type
	switch (form.menuType) {
		case 1:
			baseRules.defaultPath = [
				{
					validator: (rule: any, value: any, callback: any) => {
						if (form.assembly === 'Layout' && !value) {
							callback(new Error('当前端组件为Layout时，必填'))
						} else {
							callback()
						}
					},
					trigger: 'blur'
				}
			]
			break

		case 2:
			baseRules.parentName = [{ required: true, message: '请选择上级菜单' }]
			break

		case 3:
			delete baseRules.assembly
			baseRules.menuName[0].message = '请输入按钮名称'
			baseRules.parentName = [{ required: true, message: '请选择上级菜单' }]
			baseRules.grantCode = [{ required: true, message: '请输入权限标识' }]
			break
	}

	//切换是否是外链
	if (form.isOutLinks === 1) {
		if (form.menuType === 1) {
			delete baseRules.assembly
			delete baseRules.defaultPath
		} else if (form.menuType === 2) {
			delete baseRules.assembly
		}
	}

	return baseRules
})
//提交按钮loading
const submitLoading = ref<boolean>(false)
//转换弹窗标题
const transTitle = computed(() => {
	const config = {
		1: '新增菜单',
		2: '修改菜单',
		3: '菜单详情'
	}
	return config[props.openType]
})

/**
 * +++++++++++++++++++++++++++++++++++++++++
 * 转换下拉框树形结构的label
 * +++++++++++++++++++++++++++++++++++++++++
 * **/
function transLabel(data: any) {
	return data?.meta?.menuName || '未知'
}

/**
 * +++++++++++++++++++++++++++++++++++++++++
 * 选择icon
 * +++++++++++++++++++++++++++++++++++++++++
 * **/
function onChooseIcon(iconName: string) {
	form.menuIcon = iconName
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
			let submitForm: any = cloneDeep(toRaw(form))
			submitForm = omit(submitForm, ['menuId'])
			submitLoading.value = true
			addMenu(submitForm as any)
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
			const submitForm = cloneDeep(toRaw(form))
			submitLoading.value = true
			updateMenu(submitForm as any)
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
	})
}

/**
 * +++++++++++++++++++++++++++++++++++++++++
 * 选择上级菜单
 * +++++++++++++++++++++++++++++++++++++++++
 * **/
function menuTreeNodeSelect(node: AllRouter) {
	form.parentId = node.menuId
	form.parentName = node.meta.menuName
}

/**
 * +++++++++++++++++++++++++++++++++++++++++
 * resetForm，因为这里面有很多附带数据，所以不适用
 * Form原生重置方法
 * +++++++++++++++++++++++++++++++++++++++++
 * **/
function onResetForm() {
	const baseForm = {
		menuId: 0,
		menuType: 1,
		routeStatus: 1,
		sort: 1,
		menuName: '',
		menuPath: '',
		assembly: '',
		defaultPath: '',
		parentId: 0,
		parentName: '',
		grantStatus: 1,
		grantType: 1,
		grantCode: '',
		menuIcon: '',
		routeName: '',
		isOutLinks: 2
	}
	for (let key in baseForm) {
		form[key] = baseForm[key]
	}
	nextTick(() => formRef.value.clearValidate())
}

/**
 * +++++++++++++++++++++++++++++++++++++++++
 * 切换菜单类型的重置表单
 * +++++++++++++++++++++++++++++++++++++++++
 * **/
function onResetOtherForm() {
	const baseForm = {
		routeStatus: 1,
		sort: 1,
		menuName: '',
		menuPath: '',
		assembly: '',
		defaultPath: '',
		parentId: 0,
		parentName: '',
		grantStatus: 1,
		grantType: 1,
		grantCode: '',
		menuIcon: '',
		routeName: '',
		isOutLinks: 2
	}
	for (let key in baseForm) {
		form[key] = baseForm[key]
	}
	nextTick(() => {
		formRef.value.clearValidate()
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
