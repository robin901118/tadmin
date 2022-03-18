<!--添加用户弹窗-->
<template>
	<el-drawer v-model="visible" size="30%" :title="props.type === 'add' ? '新增' : props.type === 'edit' ? '编辑' : '详情'" :close-on-click-modal="false" @close="formRef.resetFields()">
		<el-form :model="form" label-position="top" ref="formRef" :rules="rules" :disabled="props.type === 'detail'">
			<el-divider content-position="left">
				<span class="tadmin-text-18 tadmin-text-666">
					<el-icon><MessageBox /></el-icon>
					<span class="tadmin-pl-10">基本信息</span>
				</span>
			</el-divider>
			<el-form-item label="所属租户" prop="tenantId" v-if="isSuperAdmin">
				<el-select v-model="form.tenantId" placeholder="请选择租户" style="width: 100%">
					<el-option v-for="item in props.tenantList" :label="item.tenantName" :value="item.tenantId" :key="item.tenantId" />
				</el-select>
			</el-form-item>
			<el-form-item label="登录账号" prop="account">
				<el-input placeholder="请输入用户账号" v-model="form.account" class="tadmin-w-full" />
			</el-form-item>
			<div class="tadmin-h-20"></div>
			<el-divider content-position="left">
				<span class="tadmin-text-18 tadmin-text-666">
					<el-icon><Tickets /></el-icon>
					<span class="tadmin-pl-10">详细信息</span>
				</span>
			</el-divider>
			<el-row :gutter="20">
				<el-col :span="12">
					<el-form-item label="用户昵称" prop="name">
						<el-input placeholder="请输入用户昵称" v-model="form.name" />
					</el-form-item>
				</el-col>
				<el-col :span="12">
					<el-form-item label="用户姓名" prop="realName">
						<el-input placeholder="请输入用户姓名" v-model="form.realName" />
					</el-form-item>
				</el-col>
				<el-col :span="12">
					<el-form-item label="手机号" prop="phone" required>
						<el-input placeholder="请输入手机号" v-model="form.phone" maxlength="11" />
					</el-form-item>
				</el-col>
				<el-col :span="12">
					<el-form-item label="性别" prop="sex">
						<t-dict v-model="form.sex" label="sex" />
					</el-form-item>
				</el-col>
				<el-col :span="12">
					<el-form-item label="生日" prop="birthday">
						<el-date-picker v-model="form.birthday" type="date" placeholder="请选择生日" style="width: 100%" value-format="YYYY-MM-DD" />
					</el-form-item>
				</el-col>
				<el-col :span="12">
					<el-form-item label="用户邮箱" prop="email">
						<el-input placeholder="请输入用户邮箱" v-model="form.email" />
					</el-form-item>
				</el-col>
			</el-row>
		</el-form>
		<template #footer>
			<div class="tadmin-flex tadmin-justify-end">
				<el-button @click="visible = false">关闭</el-button>
				<el-button type="primary" @click="onAddHandle" v-if="props.type === 'add'" :loading="subLoading">新增</el-button>
				<el-button type="primary" @click="onUpdateHandle" v-else-if="props.type === 'edit'" :loading="subLoading">修改</el-button>
			</div>
		</template>
	</el-drawer>
</template>

<script lang="ts" setup>
import { ElForm, ElMessage } from 'element-plus'
import { addUser, updateUser } from '@/api/system/user'
import { cloneDeep, omit } from 'lodash'
import type { TenantItem } from '@/api/system/tenant'
import type { UpdateUser } from '@/api/system/user'
import { useUserStore } from '@/store/user'
import { isPhone } from '@/utils/common'

interface Props {
	modelValue: boolean
	type: 'add' | 'edit' | 'detail'
	tenantList: TenantItem[]
}

const props = withDefaults(defineProps<Props>(), {
	//显示隐藏
	modelValue: false,
	// add->添加 edit->编辑 detail->详情
	type: 'add',
	//所有的租户
	tenantList: () => []
})
//用户实例
const userStore = useUserStore()
const emit = defineEmits(['update:modelValue', 'success'])
const isSuperAdmin = userStore.isSuper === 1
//弹窗显示隐藏
const visible = ref<boolean>(false)
//表单实例
const formRef = ref<InstanceType<typeof ElForm>>()
//表单
const form = reactive<UpdateUser>({
	//租户id
	tenantId: '',
	//登录账号
	account: '',
	//昵称
	name: '',
	//用户姓名
	realName: '',
	//手机号
	phone: '',
	//性别
	sex: 1,
	//生日
	birthday: '',
	//邮箱
	email: '',
	//用户id
	userId: '',
	//头像
	avatar: ''
})
//校验规则
const rules = computed(() => {
	const baseRules: any = {
		account: [{ required: true, message: '请输入登录账号' }],
		name: [{ required: true, message: '请输入昵称' }],
		realName: [{ required: true, message: '请输入用户姓名' }],
		phone: [
			{ required: true, message: '请输入手机号' },
			{
				validator: (rule: any, value: any, callback: any) => {
					isPhone(value) ? callback() : callback(new Error('请正确输入手机号'))
				},
				trigger: 'blur'
			}
		]
	}
	//超级用户
	isSuperAdmin && (baseRules.tenantId = [{ required: true, message: '请选择租户' }])

	return baseRules
})
//保存按钮loading
const subLoading = ref<boolean>(false)

/**
 * +++++++++++++++++++++++++++++++++++++++++
 * 新增用户
 * +++++++++++++++++++++++++++++++++++++++++
 * **/
function onAddHandle() {
	formRef.value.validate((valid: boolean) => {
		if (valid) {
			subLoading.value = true
			let subForm: any = cloneDeep(toRaw(form))
			subForm = omit(subForm, ['userId'])
			//设置默认头像
			subForm.avatar = subForm.avatar || 'https://pic1.zhimg.com/50/v2-6afa72220d29f045c15217aa6b275808_hd.jpg'
			//如果不是超级管理员，新增用户的时候带自己的租户id
			!isSuperAdmin && (subForm.tenantId = userStore.tenantId)
			addUser(subForm)
				.then(() => {
					ElMessage({
						type: 'success',
						message: '添加成功'
					})
					visible.value = false
					emit('success')
				})
				.finally(() => (subLoading.value = false))
		}
	})
}

/**
 * +++++++++++++++++++++++++++++++++++++++++
 * 修改用户
 * +++++++++++++++++++++++++++++++++++++++++
 * **/
function onUpdateHandle() {
	formRef.value.validate((valid: boolean) => {
		if (valid) {
			subLoading.value = true
			const cloneData: UpdateUser = cloneDeep(form)
			updateUser(cloneData)
				.then(() => {
					ElMessage({
						type: 'success',
						message: '修改成功'
					})
					visible.value = false
					emit('success')
				})
				.finally(() => {
					subLoading.value = false
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

<style lang="scss" scoped>
.el-select-dropdown__item {
	.hookIcon {
		opacity: 0;
	}

	&.selected {
		.hookIcon {
			opacity: 1;
		}
	}
}
::v-deep(.el-input__validateIcon) {
	display: none;
}
</style>
