<template>
	<div>
		<el-drawer v-model="visible" :title="props.isAdd ? '新增任务' : '修改任务'" :close-on-click-modal="false" @close="formRef.resetFields()">
			<el-form label-width="100px" :model="form" ref="formRef">
				<el-form-item label="任务名称" prop="name">
					<el-input placeholder="请输入任务名称" v-model="form.name" />
				</el-form-item>
				<el-form-item label="具体执行类" prop="clazz">
					<el-input placeholder="请输入执行类" v-model="form.clazz" />
				</el-form-item>
				<el-form-item label="cron表达式" prop="cron">
					<el-input placeholder="* * * * * ? *" v-model="form.cron">
						<template #append>
							<el-button @click.stop="cronVisible = true">选择</el-button>
						</template>
					</el-input>
				</el-form-item>
				<el-form-item label="描述" prop="description">
					<el-input type="textarea" :row="4" placeholder="请输入描述" v-model="form.description" />
				</el-form-item>
				<el-form-item label="其它参数" prop="jobDataMap">
					<el-row :gutter="10" class="tadmin-w-full">
						<template v-for="(item, index) in form.jobDataMap" :key="index">
							<el-col :span="11" class="tadmin-mb-10">
								<el-input placeholder="请输入参数名" v-model="item[0]" />
							</el-col>
							<el-col :span="11" class="tadmin-mb-10">
								<el-input placeholder="请输入参数值" v-model="item[1]" />
							</el-col>
							<el-col :span="2" class="tadmin-mb-10" v-if="index !== 0">
								<el-button icon="Close" type="danger" plain @click="form.jobDataMap.splice(index, 1)"></el-button>
							</el-col>
						</template>
					</el-row>
					<el-button icon="Plus" @click="form.jobDataMap.push(['', ''])">加一条</el-button>
				</el-form-item>
			</el-form>

			<template #footer>
				<el-button type="primary" v-if="props.isAdd" @click="onAdd" :loading="subLoading">新增</el-button>
				<el-button type="primary" v-else :loading="subLoading" @click="onUpdate">修改</el-button>
				<el-button @click="visible = false">关闭</el-button>
			</template>
		</el-drawer>
		<el-dialog title="设置cron" v-model="cronVisible">
			<t-cron @change="onSaveCron" @close="cronVisible = false" max-height="400px" />
		</el-dialog>
	</div>
</template>

<script lang="ts" setup>
import TCron from '@/components/TCron.vue'
import { addTask, updateTask } from '@/api/system/task'
import { cloneDeep } from 'lodash'
import { ElMessage, ElForm } from 'element-plus'

const props = defineProps({
	//显示隐藏
	modelValue: {
		type: Boolean,
		default: false
	},
	//是否新增
	isAdd: {
		type: Boolean,
		default: true
	}
})
const emit = defineEmits(['update:modelValue', 'success'])
//抽屉显示隐藏
const visible = ref<boolean>(false)
//cron弹窗显示隐藏
const cronVisible = ref<boolean>(false)
const form = reactive({
	name: '',
	clazz: '',
	cron: '',
	description: '',
	jobDataMap: [['', '']]
})
const rules = {
	name: [{ required: true, message: '请输入任务名称' }],
	clazz: [{ required: true, message: '请输入具体执行类' }],
	cron: [{ required: true, message: '请选择cron表达式' }]
}
const subLoading = ref<boolean>(false)
const formRef = ref<InstanceType<typeof ElForm>>(null)

/**
 * ++++++++++++++++++++++++++++++++++++++++
 * 保存cron表达式
 * ++++++++++++++++++++++++++++++++++++++++
 * **/
function onSaveCron(cron: any) {
	typeof cron === 'string' && (form.cron = cron)
}

/**
 * ++++++++++++++++++++++++++++++++++++++++
 * 转换提交数据
 * ++++++++++++++++++++++++++++++++++++++++
 * **/
function transSubForm(subForm: any): any {
	subForm = cloneDeep(toRaw(form))
	subForm.jobDataMap = [...new Map(subForm.jobDataMap)].filter(item => item[0] !== '' || item[1] !== '')
	if (subForm.jobDataMap.length) {
		subForm.jobDataMap = Array.from(subForm.jobDataMap).reduce((obj, [key, value]) => Object.assign(obj, { [key]: value }), {})
	} else {
		delete subForm.jobDataMap
	}
	return subForm
}

/**
 * ++++++++++++++++++++++++++++++++++++++++
 * 新增
 * ++++++++++++++++++++++++++++++++++++++++
 * **/
function onAdd() {
	//对【jobDataMap】字段进行处理成json对象
	subLoading.value = true
	addTask(transSubForm(form))
		.then(() => {
			visible.value = false
			ElMessage.success('新增成功')
			emit('success')
		})
		.finally(() => {
			subLoading.value = false
		})
}

/**
 * ++++++++++++++++++++++++++++++++++++++++
 * 修改任务
 * ++++++++++++++++++++++++++++++++++++++++
 * **/
function onUpdate() {
	subLoading.value = true
	updateTask(transSubForm(form))
		.then(() => {
			visible.value = false
			ElMessage.success('修改成功')
			emit('success')
		})
		.finally(() => {
			subLoading.value = false
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

defineExpose({ form })
</script>
