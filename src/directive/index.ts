import type { App } from 'vue'
import { catch_dict_key } from '@/config'
import { useUserStore } from '@/store/user'
import { isArray } from 'lodash'
import { ElMessage } from 'element-plus'

export default (app: App) => {
	// 字典解析指令
	function dict(el, params) {
		try {
			//获取全局字典
			let catchDict: any = localStorage.getItem(catch_dict_key)
			if (!catchDict) {
				return (el.innerText = '字典错误')
			}
			catchDict = JSON.parse(catchDict)
			const allDictMaps = catchDict?.dictMap
			el.innerText = allDictMaps?.[params.label]?.[params.value] || '-'
		} catch (e) {
			console.error(e)
		}
	}
	/**
	 * +++++++++++++++++++++++++++++++++++++++++++++++++++++++
	 * 字典转换
	 * +++++++++++++++++++++++++++++++++++++++++++++++++++++++
	 */
	app.directive('dict', {
		mounted(el, { value }) {
			dict(el, value)
		},
		beforeUpdate(el, { value }) {
			dict(el, value)
		}
	})

	/**
	 * +++++++++++++++++++++++++++++++++++++++++++++++++++++++
	 * 用户权限指令
	 * +++++++++++++++++++++++++++++++++++++++++++++++++++++++
	 */
	const userStore = useUserStore()
	const bindAuthFun = function (el: any) {
		return el.addEventListener(
			'click',
			function (e) {
				ElMessage.warning('您没有该权限，请联系管理员！')
				e.stopImmediatePropagation()
			},
			true
		)
	}

	// 单个权限验证（v-auth="xxx"）
	app.directive('auth', {
		mounted(el, { value }) {
			!userStore.permission.has(value) && bindAuthFun(el)
		}
	})
	// 多个权限验证，满足一个则显示（v-auth-some="[xxx,xxx]"）
	app.directive('auth-some', {
		mounted(el, { value }) {
			if (isArray(value)) {
				const flag = value.some(item => userStore.permission.has(item))
				!flag && bindAuthFun(el)
			} else {
				bindAuthFun(el)
			}
		}
	})
	// 多个权限验证，全部满足则显示（v-auth-every="[xxx,xxx]"）
	app.directive('auth-every', {
		mounted(el, { value }) {
			if (isArray(value)) {
				const flag = value.every(item => userStore.permission.has(item))
				if (!flag) bindAuthFun(el)
			} else {
				bindAuthFun(el)
			}
		}
	})
}
