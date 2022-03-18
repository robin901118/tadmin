<template>
	<div class="tadmin-flex tadmin-items-center tadmin-justify-center tadmin-h-full">
		<el-card shadow="always" class="tadmin-w-[800px]">
			<el-row class="tadmin-h-full" :gutter="20">
				<el-col :span="7" class="tadmin-h-full" style="border-right: 1px solid var(--el-border-color-base)">
					<div class="tadmin-flex tadmin-items-center tadmin-justify-center tadmin-pt-20">
						<t-img-upload :policy-request="getPolicy" :upload-props="uploadProps" v-model="avatar" @change="avatarChange" />
					</div>
					<h1 class="tadmin-text-center tadmin-text-20 tadmin-my-20" style="color: var(--el-color-primary)">{{ userStore.name }}</h1>
					<div class="infoItem">
						<div>
							<span>用户ID：</span>
							<span>{{ userStore.userId }}</span>
						</div>
						<div>
							<span>租户ID：</span>
							<span>{{ userStore.tenantId }}</span>
						</div>
						<div>
							<span>账号：</span>
							<span>{{ userStore.account }}</span>
						</div>
						<div>
							<span>所属租户：</span>
							<span>{{ userStore.tenantName }}</span>
						</div>
						<div>
							<span>账号状态：</span>
							<span v-dict="{ label: 'status', value: userStore.status }"></span>
						</div>
					</div>
				</el-col>
				<el-col :span="17">
					<div class="tadmin-pl-10">
						<el-tabs v-model="activeName">
							<el-tab-pane label="个人信息" name="baseInfo" class="tadmin-pt-20">
								<el-form :model="form" :rules="infoRules" label-width="80px" ref="infoRef">
									<el-form-item label="姓名" prop="realName">
										<el-input placeholder="请输入姓名" v-model="form.realName" clearable />
									</el-form-item>
									<el-form-item label="昵称" prop="name">
										<el-input placeholder="请输入昵称" v-model="form.name" clearable />
									</el-form-item>
									<el-form-item label="手机号" prop="phone">
										<el-input placeholder="请输入手机号" maxlength="11" v-model="form.phone" clearable />
									</el-form-item>
									<el-form-item label="性别" prop="sex">
										<t-dict label="sex" v-model="form.sex" />
									</el-form-item>
									<el-form-item label="邮箱" prop="email">
										<el-input placeholder="请输入邮箱" v-model="form.email" clearable />
									</el-form-item>
									<div class="tadmin-text-right tadmin-mt-40">
										<el-button type="primary" @click="onConfrimInfo" :loading="baseSubLoading">确认</el-button>
										<el-button @click="infoRef.resetFields()">清空</el-button>
									</div>
								</el-form>
							</el-tab-pane>
							<el-tab-pane label="修改密码" name="psw" class="tadmin-pt-20">
								<el-form :model="pswForm" :rules="pswRules" label-width="80px" ref="pswRef">
									<el-form-item label="原密码" prop="oldPassword">
										<el-input placeholder="请输入原密码" v-model="pswForm.oldPassword" clearable type="password" show-password />
									</el-form-item>
									<el-form-item label="新密码" prop="newPassword">
										<el-input placeholder="请输入原密码" v-model="pswForm.newPassword" clearable type="password" show-password />
									</el-form-item>
									<el-form-item label="确认密码" prop="confirmPsw">
										<el-input placeholder="请再次输入密码" v-model="pswForm.confirmPsw" clearable type="password" show-password />
									</el-form-item>
									<div class="tadmin-text-right tadmin-mt-40">
										<el-button type="primary" @click="onConfrimPsw" :loading="pswSubLoading">确认</el-button>
										<el-button @click="pswRef.resetFields()">重置</el-button>
									</div>
								</el-form>
							</el-tab-pane>
						</el-tabs>
					</div>
				</el-col>
			</el-row>
		</el-card>
	</div>
</template>

<script lang="ts" setup>
import { ElForm, ElMessage, ElMessageBox } from 'element-plus'
import { getPolicy } from '@/api/system/other'
import TImgUpload from '@/components/TImgUpload.vue'
import { useUserStore } from '@/store/user'
import { cloneDeep, omit } from 'lodash'
import { changeSelfInfo, updateUserPsw } from '@/api/system/user'
import { isPhone } from '@/utils/common'

const avatar = ref<string>('')
const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const activeName = ref<string>('baseInfo')
//头像上传组件参数
const uploadProps = {
	showFileList: false
}
const form = reactive({
	realName: '',
	name: '',
	phone: '',
	email: '',
	sex: 0
})
const infoRules = {
	realName: [{ required: true, message: '请输入真实名字' }],
	name: [{ required: true, message: '请输入昵称' }],
	phone: {
		validator: (rule: any, value: any, callback: any) => {
			if (!value) return callback()
			isPhone(value) ? callback() : callback(new Error('请正确输入手机号'))
		},
		trigger: 'blur'
	}
}
const pswForm = reactive({
	oldPassword: '',
	newPassword: '',
	confirmPsw: ''
})
const pswRules: any = {
	oldPassword: [{ required: true, message: '请输入原密码' }],
	newPassword: [{ required: true, message: '请输入新密码' }],
	confirmPsw: [
		{ required: true, message: '请输入确认密码' },
		{
			validator: (rule: any, value: any, callback: any) => {
				return pswForm.newPassword === value ? callback() : callback(new Error('两次密码输入不一致'))
			},
			trigger: ['blur', 'change']
		}
	]
}
const infoRef = ref<InstanceType<typeof ElForm>>()
const pswRef = ref<InstanceType<typeof ElForm>>()
//基本信息提交按钮loading
const baseSubLoading = ref<boolean>(false)
//修改密码提交按钮loading
const pswSubLoading = ref<boolean>(false)

/**
 * +++++++++++++++++++++++++++++++++++++++++
 * 提交个人信息修改
 * +++++++++++++++++++++++++++++++++++++++++
 * **/
function onConfrimInfo() {
	infoRef.value.validate(valid => {
		if (valid) {
			baseSubLoading.value = true
			changeSelfInfo(toRaw(form) as any)
				.then(() => {
					ElMessage.success('修改成功')
					//刷新全局用户信息
					userStore.GET_USER_INFO()
				})
				.finally(() => {
					baseSubLoading.value = false
				})
		}
	})
}

/**
 * +++++++++++++++++++++++++++++++++++++++++
 * 提交密码修改
 * +++++++++++++++++++++++++++++++++++++++++
 * **/
function onConfrimPsw() {
	pswRef.value.validate(valid => {
		if (valid) {
			if (pswForm.oldPassword === pswForm.newPassword) {
				return ElMessage.error('新密码不能和旧密码一致')
			}
			let submitForm: any = cloneDeep(toRaw(pswForm))
			submitForm = omit(submitForm, ['confirmPsw'])
			pswSubLoading.value = true
			updateUserPsw(submitForm)
				.then(() => {
					ElMessageBox({
						title: '密码修改成功',
						message: '现在需要重新登录吗？',
						showCancelButton: true,
						confirmButtonText: '重新登录',
						cancelButtonText: '稍后再说'
					}).then(() => {
						userStore.USER_LOGOUT()
					})
				})
				.finally(() => {
					pswSubLoading.value = false
				})
		}
	})
}

/**
 * +++++++++++++++++++++++++++++++++++++++++
 * 头像上传
 * +++++++++++++++++++++++++++++++++++++++++
 * **/
function avatarChange(src: string) {
	changeSelfInfo({
		avatar: src
	} as any)
		.then(() => {
			ElMessage.success('上传成功')
			//刷新全局用户信息
			userStore.GET_USER_INFO()
		})
		.catch(() => {
			ElMessage.error('上传失败')
		})
}

//监听router参数
activeName.value = (route.query?.active as string) || 'baseInfo'
router.beforeEach(guard => {
	activeName.value = (guard.query?.active as string) || 'baseInfo'
})
onMounted(() => {
	for (let item in form) {
		userStore?.[item] && (form[item] = cloneDeep(userStore[item]))
	}
	avatar.value = userStore.avatar
})
</script>

<style lang="scss" scoped>
.infoItem {
	> div {
		@apply tadmin-flex tadmin-items-center;
		height: 38px;
		> span:first-child {
			@apply tadmin-inline-block tadmin-text-right tadmin-text-14;
			width: 7em;
		}
		> span:last-child {
			@apply tadmin-text-14 tadmin-flex-1;
		}
	}
}
</style>
