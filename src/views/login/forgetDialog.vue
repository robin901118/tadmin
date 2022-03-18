<template>
	<el-dialog v-model="visible" title="忘记密码" width="25%" @open="dialogOpen">
		<el-form :model="form" label-position="top" :rules="rules" size="large" ref="formRef" hide-required-asterisk @keyup.enter.native="onSubmit">
			<el-form-item label="租户ID" prop="tenantId">
				<el-input placeholder="请输入租户ID" v-model="form.tenantId" clearable />
			</el-form-item>
			<el-form-item label="手机号" prop="phone">
				<el-input placeholder="请输入手机号" v-model="form.phone" :maxlength="11" clearable />
			</el-form-item>
			<el-form-item label="短信验证码" prop="code">
				<div class="tadmin-flex tadmin-justify-between tadmin-items-center tadmin-w-full">
					<el-input placeholder="请输入短信验证码" v-model="form.code" class="tadmin-flex-1" clearable />
					<el-button type="primary" class="tadmin-ml-20" :disabled="disabledGetSmsBtn" @click="onGetSmsCode">{{ smsBtnTxt }}</el-button>
				</div>
			</el-form-item>
			<el-form-item label="新密码" prop="newPassword">
				<el-input placeholder="请输入新密码" v-model="form.newPassword" type="password" clearable />
			</el-form-item>
			<el-form-item label="确认新密码" prop="confirmPwd">
				<el-input placeholder="请再次输入新密码" v-model="form.confirmPwd" type="password" clearable />
			</el-form-item>
			<el-button type="primary" class="tadmin-w-full tadmin-mt-30" :loading="submitLoading" @click="onSubmit">提交</el-button>
		</el-form>
	</el-dialog>
</template>

<script lang="ts" setup>
import type { ElForm } from 'element-plus'
import { isPhone } from '@/utils/common'
import { useAppStore } from '@/store/app'
import { get_sms_duration } from '@/config'
import { forgetPsw } from '@/api/system/login'
import { getSmsCode } from '@/api/system/other'
import { omit, cloneDeep } from 'lodash'
import { ElMessage } from 'element-plus'

const props = defineProps({
	modelValue: {
		type: Boolean,
		default: false
	}
})
let smsTimer: any = null
//APP状态实例
const appStore = useAppStore()
const emit = defineEmits(['update:modelValue', 'success'])
const formRef = ref<InstanceType<typeof ElForm>>(null)
const visible = ref<boolean>(false)
const form = reactive({
	tenantId: '',
	phone: '',
	confirmPwd: '',
	newPassword: '',
	code: ''
})
const submitLoading = ref<boolean>(false)
const rules = {
	tenantId: { required: true, message: '请输入租户id' },
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
	code: { required: true, message: '请输入短信验证码' },
	newPassword: { required: true, message: '请输入新密码' },
	confirmPwd: {
		validator: (rule: any, value: any, callback: any) => {
			if (form.newPassword === value && value) {
				callback()
			} else {
				callback(new Error('两次密码输入不一致'))
			}
		},
		trigger: 'blur'
	}
}
//禁用获取验证码按钮
const disabledGetSmsBtn = ref<boolean>(false)
const smsBtnTxt = ref<string>('获取验证码')

/**
 * +++++++++++++++++++++++++++++++++++++++++
 * 提交
 * +++++++++++++++++++++++++++++++++++++++++
 * **/
function onSubmit() {
	formRef.value.validate(valid => {
		if (valid) {
			submitLoading.value = true
			let subForm: any = omit(cloneDeep(toRaw(form)), ['confirmPwd'])
			forgetPsw(subForm)
				.then(() => {
					ElMessage.success('重置密码成功!')
					visible.value = false
					emit('success')
					formRef.value.resetFields()
					resetSmsBtn()
				})
				.finally(() => {
					submitLoading.value = false
				})
		}
	})
}

/**
 * +++++++++++++++++++++++++++++++++++++++++
 * 获取短信验证码
 * +++++++++++++++++++++++++++++++++++++++++
 * **/
function onGetSmsCode() {
	if (isPhone(form.phone)) {
		getSmsCode({ phone: form.phone })
			.then(res => {
				ElMessage.success('已发送')
			})
			.catch(() => resetSmsBtn())
		smsBtnCountdown()
	} else {
		//@ts-ignore
		formRef.value.validateField(['phone'])
	}
}

/**
 * +++++++++++++++++++++++++++++++++++++++++
 * 短信验证码按钮倒计时
 * +++++++++++++++++++++++++++++++++++++++++
 * **/
function smsBtnCountdown() {
	let countdown = appStore.forgetSmsDuration
	if (countdown < 1) {
		resetSmsBtn()
		return
	}
	appStore.SET_SMS_FORGET_DURATION(countdown - 1)
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
		appStore.SET_SMS_FORGET_DURATION(get_sms_duration)
		disabledGetSmsBtn.value = false
		smsTimer = null
		smsBtnTxt.value = '获取验证码'
	}
}

/**
 * +++++++++++++++++++++++++++++++++++++++++
 * 弹窗打开事件
 * +++++++++++++++++++++++++++++++++++++++++
 * **/
function dialogOpen() {
	const countdown = appStore.forgetSmsDuration
	if (countdown == 0 || countdown == get_sms_duration) {
		appStore.SET_SMS_FORGET_DURATION(get_sms_duration)
	} else {
		smsBtnCountdown()
	}
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
</script>
