<template>
	<div class="tadmin-w-[100%] tadmin-h-[100vh] tadmin-bg-lightBlue dark:tadmin-bg-darkBlue tadmin-flex tadmin-items-center tadmin-justify-center">
		<section class="tadmin-w-[80vw] tadmin-h-[600px] center-block tadmin-rounded-[5px] tadmin-bg-white dark:tadmin-bg-darkBlueLight lg:tadmin-w-2/4">
			<div class="tadmin-w-full tadmin-p-[5%_5%_0] lg:tadmin-w-[50%]">
				<h1 class="tadmin-text-50 tadmin-font-500 tadmin-lh-0 tadmin-mb-10">Hello!</h1>
				<h2 class="tadmin-text-20 tadmin-font-thin tadmin-mb-[2em]">登录管理平台</h2>
				<el-tabs v-model="tabActive">
					<el-tab-pane label="账号密码登录" name="account">
						<el-form :model="accountForm" :rules="rules" hide-required-asterisk size="large" ref="accountFormRef" @keyup.enter.native="accountSubmitHandle">
							<el-form-item prop="tenantId">
								<el-input v-model="accountForm.tenantId" placeholder="请输入租户ID" clearable prefix-icon="Medal" />
							</el-form-item>
							<el-form-item prop="account">
								<el-input v-model="accountForm.account" placeholder="请输入账号" clearable prefix-icon="User" />
							</el-form-item>
							<el-form-item prop="password">
								<el-input v-model="accountForm.password" type="password" placeholder="请输入密码" clearable prefix-icon="Lock" />
							</el-form-item>
							<el-form-item prop="captcha">
								<div class="flexJustify tadmin-w-full">
									<el-input v-model="accountForm.captcha" placeholder="请输入图形验证码" clearable prefix-icon="Picture" class="tadmin-flex tadmin-flex-1" />
									<el-image class="tadmin-h-40 tadmin-w-1/3 tadmin-ml-20 tadmin-cursor-pointer" :src="captcha" fit="fill" @click="onGetCap" />
								</div>
							</el-form-item>
							<el-button type="primary" size="large" @click="accountSubmitHandle" :loading="loginLoading" style="width: 100%">
								{{ loginLoading ? '登陆中...' : '登录' }}
							</el-button>
							<div class="tadmin-flex tadmin-justify-between">
								<el-button type="text" @click="forgetDialogVisible = true">忘记密码?</el-button>
								<el-checkbox v-model="isRemember">记住账号密码</el-checkbox>
							</div>
						</el-form>
					</el-tab-pane>
					<el-tab-pane label="手机验证码登录" name="mobile">
						<el-form hide-required-asterisk :model="mobileForm" :rules="mobileRules" size="large" ref="mobileFormRef" @keyup.enter.native="mobileSubmitHandle">
							<el-form-item prop="tenantId">
								<el-input v-model="mobileForm.tenantId" placeholder="请输入租户ID" clearable prefix-icon="Medal" />
							</el-form-item>
							<el-form-item prop="phone">
								<el-input placeholder="请输入手机号码" clearable prefix-icon="Cellphone" v-model="mobileForm.phone" :maxlength="11" />
							</el-form-item>
							<el-form-item prop="code">
								<div class="flexJustify tadmin-w-full">
									<el-input placeholder="请输入短信验证码" clearable prefix-icon="ChatLineSquare" class="tadmin-flex tadmin-flex-1" v-model="mobileForm.code" />
									<el-button type="primary" class="tadmin-ml-20" :disabled="disabledGetSmsBtn" @click="onGetSmsCode">{{ smsBtnTxt }}</el-button>
								</div>
							</el-form-item>
							<el-button type="primary" size="large" @click="mobileSubmitHandle" :loading="loginLoading" style="width: 100%">
								{{ loginLoading ? '登陆中...' : '登录' }}
							</el-button>
							<div class="tadmin-text-right">
								<el-checkbox v-model="isRememberMobile">记住手机号</el-checkbox>
							</div>
						</el-form>
					</el-tab-pane>
				</el-tabs>
			</div>
			<div class="tadmin-w-[50%] tadmin-h-full right-img tadmin-hidden lg:tadmin-block"></div>
		</section>
		<!--忘记密码弹窗-->
		<forget-dialog v-model="forgetDialogVisible" @success="onGetCap" />
	</div>
</template>

<script lang="ts" setup>
import { ElMessage } from 'element-plus'
import type { ElForm } from 'element-plus'
import { setToken } from '@/utils/auth'
import { userLogin, getCaptcha, smsLogin } from '@/api/system/login'
import type { LoginData } from '@/api/system/login'
import Cookies from 'js-cookie'
import { login_info_key, login_info_expires, get_sms_duration, login_info_mobile } from '@/config'
import { useAppStore } from '@/store/app'
import { isPhone } from '@/utils/common'
import forgetDialog from './forgetDialog.vue'
import { getSmsCode } from '@/api/system/other'

//APP状态实例
const appStore = useAppStore()
//获取短信验证码倒计时
let smsTimer: any = null
//路由实例
const router = useRouter()
//tab切换值
const tabActive = computed({
	set(nv: string) {
		appStore.SET_LOGIN_ACTIVE(nv)
		loginLoading.value = false
	},
	get() {
		return appStore.loginActive
	}
})
//账号登录校验规则
const rules = {
	account: { required: true, message: '请输入账号' },
	password: { required: true, message: '请输入密码' },
	tenantId: { required: true, message: '请输入租户ID' },
	captcha: { required: true, message: '请输入图形验证码' }
}
//手机登录校验规则
const mobileRules = {
	tenantId: { required: true, message: '请输入租户ID' },
	phone: {
		validator: (rule: any, value: any, callback: any) => {
			if (isPhone(value)) {
				callback()
			} else {
				callback(new Error('请正确输入手机号码'))
			}
		},
		trigger: 'blur'
	},
	code: { required: true, message: '请输入短信验证码' }
}
//账号登录表单实例
const accountFormRef = ref<InstanceType<typeof ElForm>>(null)
//手机号码登录表单实例
const mobileFormRef = ref<InstanceType<typeof ElForm>>(null)
//账号密码登录表单
const accountForm = reactive<LoginData>({
	tenantId: '',
	account: '',
	password: '',
	captchaKey: '',
	captcha: ''
})
//手机短信验证码登录表单
const mobileForm = reactive({
	tenantId: '',
	phone: '',
	code: ''
})
//禁用获取验证码按钮
const disabledGetSmsBtn = ref<boolean>(false)
const smsBtnTxt = ref<string>('获取验证码')
//登录按钮loading
const loginLoading = ref<boolean>(false)
const setDictCatch: any = inject('setDictCatch')
const captcha = ref<string>('')
//是否需要记住用户名
const isRemember = ref<boolean>(true)
//忘记密码弹窗显示隐藏
const forgetDialogVisible = ref<boolean>(false)
//是否记住手机号
const isRememberMobile = ref<boolean>(true)

/**
 * +++++++++++++++++++++++++++++++++++++++++
 * 账号密码登录
 * +++++++++++++++++++++++++++++++++++++++++
 * **/
function accountSubmitHandle(): void {
	accountFormRef.value.validate((valid: boolean): void => {
		if (valid) {
			loginLoading.value = true
			userLogin({ ...accountForm })
				.then(res => {
					ElMessage({ message: '登录成功!', type: 'success' })
					//记住账号，存cookie
					isRemember.value
						? Cookies.set(
								login_info_key,
								JSON.stringify({
									tenantId: accountForm.tenantId,
									account: accountForm.account,
									password: accountForm.password
								}),
								{ expires: login_info_expires, path: '' }
						  )
						: Cookies.remove(login_info_key)
					setToken(res.token)
					setDictCatch().then(() => {
						resetSmsBtn()
						router.push('/')
					})
				})
				.catch(() => onGetCap())
				.finally(() => {
					loginLoading.value = false
				})
		}
	})
}

/**
 * +++++++++++++++++++++++++++++++++++++++++
 * 获取图形验证码
 * +++++++++++++++++++++++++++++++++++++++++
 * **/
function onGetCap() {
	getCaptcha().then(res => {
		accountForm.captchaKey = res.captchaKey
		captcha.value = res.base64
	})
}

/**
 * +++++++++++++++++++++++++++++++++++++++++
 * 获取短信验证码
 * +++++++++++++++++++++++++++++++++++++++++
 * **/
function onGetSmsCode() {
	if (isPhone(mobileForm.phone)) {
		getSmsCode({ phone: mobileForm.phone })
			.then(res => {
				ElMessage.success('已发送')
			})
			.catch(() => resetSmsBtn())
		smsBtnCountdown()
	} else {
		//@ts-ignore
		mobileFormRef.value.validateField(['phone'])
	}
}

/**
 * +++++++++++++++++++++++++++++++++++++++++
 * 短信验证码按钮倒计时
 * +++++++++++++++++++++++++++++++++++++++++
 * **/
function smsBtnCountdown() {
	let countdown = appStore.loginGetSmsDuration
	if (countdown < 1) {
		resetSmsBtn()
		return
	}
	appStore.SET_SMS_DURATION(countdown - 1)
	disabledGetSmsBtn.value = true
	smsBtnTxt.value = `${countdown}s后再获取`
	smsTimer = setTimeout(() => {
		smsBtnCountdown()
	}, 1000)
}

/**
 * +++++++++++++++++++++++++++++++++++++++++
 * 重置短信按钮
 * +++++++++++++++++++++++++++++++++++++++++
 * **/
function resetSmsBtn() {
	if (smsTimer) {
		clearTimeout(smsTimer)
		appStore.SET_SMS_DURATION(get_sms_duration)
		disabledGetSmsBtn.value = false
		smsTimer = null
		smsBtnTxt.value = '获取验证码'
	}
}

/**
 * +++++++++++++++++++++++++++++++++++++++++
 * 手机号登录
 * +++++++++++++++++++++++++++++++++++++++++
 * **/
function mobileSubmitHandle() {
	mobileFormRef.value.validate(valid => {
		if (valid) {
			loginLoading.value = true
			smsLogin(toRaw(mobileForm))
				.then(res => {
					ElMessage({ message: '登录成功!', type: 'success' })
					//记住手机号，存cookie
					isRememberMobile.value
						? Cookies.set(
								login_info_mobile,
								JSON.stringify({
									tenantId: mobileForm.tenantId,
									phone: mobileForm.phone
								}),
								{ expires: login_info_expires, path: '' }
						  )
						: Cookies.remove(login_info_mobile)
					setToken(res.token)
					setDictCatch().then(() => {
						resetSmsBtn()
						router.push('/')
					})
				})
				.finally(() => {
					loginLoading.value = false
				})
		}
	})
}

//初始化，获取验证码
onGetCap()
//从cookies里获取账号密码并自动填充
let oldCookie: any = Cookies.get(login_info_key)
if (oldCookie) {
	oldCookie = JSON.parse(oldCookie)
	accountForm.tenantId = oldCookie?.tenantId || ''
	accountForm.account = oldCookie?.account || ''
	accountForm.password = oldCookie?.password || ''
}
//从cookies里获取手机号
let cookieMobile: any = Cookies.get(login_info_mobile)
if (cookieMobile) {
	cookieMobile = JSON.parse(cookieMobile)
	mobileForm.phone = cookieMobile?.phone || ''
	mobileForm.tenantId = cookieMobile?.tenantId || ''
}
//初始化页面的时候设置默认倒计时（缓存里面有数据的时候直接使用缓存里的数据）
if (appStore.loginGetSmsDuration == 0 || appStore.loginGetSmsDuration == get_sms_duration) {
	appStore.SET_SMS_DURATION(get_sms_duration)
} else {
	smsBtnCountdown()
}
</script>

<style lang="scss" scoped>
.center-block {
	box-shadow: 0 0 10px rgba(0, 0, 0, 0.05);
	@apply tadmin-flex tadmin-justify-between tadmin-overflow-hidden;
	h1,
	h2 {
		color: var(--el-color-primary);
	}
}

.right-img {
	background: url('../../assets/img/loginBg.jpg') no-repeat center top;
	background-size: cover;
}
</style>
