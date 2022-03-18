/**
 * ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
 * APP状态管理器
 * ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
 * **/
import { useCssVar } from '@vueuse/core'
import { hex2Rgb } from '@/utils/common'
import { theme_key, default_theme_color } from '@/config'
import { getMenusByTopmenuId } from '@/api/system/topmenu'
import type { AllRouter } from '@/api/system/menu'
import { router } from '@/router'

function transAside(routers: Array<AllRouter>): Array<AllRouter> {
	if (!routers.length) return []
	const trans = []
	routers.forEach(i => {
		if (i?.component === 'Layout' && i?.children) {
			i.children = transAside(i.children)
			i.children.length && trans.push(i)
		} else {
			trans.push(i)
		}
	})
	return trans
}

export const useAppStore = defineStore({
	id: 'app',
	//开启数据持久化
	persist: {
		enabled: true,
		strategies: [
			{ storage: sessionStorage, paths: ['topmenuActive', 'loginGetSmsDuration', 'forgetSmsDuration', 'theme'] },
			{ storage: localStorage, paths: ['asideIsCollapse', 'loginActive'] }
		]
	},
	state: () => ({
		//登录页面的active
		loginActive: 'account',
		//侧边栏是否收起
		asideIsCollapse: false,
		//主题色
		theme: '',
		//侧边栏菜单
		sideMenus: [],
		//顶部菜单选中的
		topmenuActive: '0',
		//登录获取短信验证码倒计时
		loginGetSmsDuration: 0,
		//忘记密码短信验证码倒计时
		forgetSmsDuration: 0
	}),
	actions: {
		/**
		 * +++++++++++++++++++++++++++++++++++++
		 * 展开|收起侧边栏
		 * +++++++++++++++++++++++++++++++++++++
		 * **/
		SET_LOGIN_ACTIVE(active: string) {
			this.loginActive = active
		},

		/**
		 * +++++++++++++++++++++++++++++++++++++
		 * 展开|收起侧边栏
		 * +++++++++++++++++++++++++++++++++++++
		 * **/
		SET_SIDE_COLLAPSE(collapse: boolean) {
			this.asideIsCollapse = collapse
		},

		/**
		 * +++++++++++++++++++++++++++++++++++++
		 * 设置主题色
		 * +++++++++++++++++++++++++++++++++++++
		 * **/
		SET_THEME(colorVal: string) {
			if (!colorVal) return false
			const el = document.documentElement
			const color = useCssVar('--el-color-primary', el)
			const color1 = useCssVar('--el-color-primary-light-1', el)
			const color2 = useCssVar('--el-color-primary-light-2', el)
			const color3 = useCssVar('--el-color-primary-light-3', el)
			const color4 = useCssVar('--el-color-primary-light-4', el)
			const color5 = useCssVar('--el-color-primary-light-5', el)
			const color6 = useCssVar('--el-color-primary-light-6', el)
			const color7 = useCssVar('--el-color-primary-light-7', el)
			const color8 = useCssVar('--el-color-primary-light-8', el)
			const color9 = useCssVar('--el-color-primary-light-9', el)
			this.theme = colorVal
			color.value = colorVal
			color1.value = `rgba(${hex2Rgb(colorVal).join(',')},.9)`
			color2.value = `rgba(${hex2Rgb(colorVal).join(',')},.8)`
			color3.value = `rgba(${hex2Rgb(colorVal).join(',')},.7)`
			color4.value = `rgba(${hex2Rgb(colorVal).join(',')},.6)`
			color5.value = `rgba(${hex2Rgb(colorVal).join(',')},.5)`
			color6.value = `rgba(${hex2Rgb(colorVal).join(',')},.4)`
			color7.value = `rgba(${hex2Rgb(colorVal).join(',')},.3)`
			color8.value = `rgba(${hex2Rgb(colorVal).join(',')},.2)`
			color9.value = `rgba(${hex2Rgb(colorVal).join(',')},.1)`
			//存储主题配色
			localStorage.setItem(theme_key, colorVal)
		},

		/**
		 * +++++++++++++++++++++++++++++++++++++
		 * 设置顶部菜单选中
		 * +++++++++++++++++++++++++++++++++++++
		 * **/
		SET_TOPMENU_ACTIVE(topmenuId: string) {
			this.topmenuActive = topmenuId
			this.GET_SIDE_MENUS()
		},

		/**
		 * +++++++++++++++++++++++++++++++++++++
		 * 获取侧边栏菜单
		 * +++++++++++++++++++++++++++++++++++++
		 * **/
		GET_SIDE_MENUS(): Promise<any> {
			const that = this
			return new Promise((resolve, reject) => {
				getMenusByTopmenuId({ topmenuId: that.topmenuActive })
					.then(res => {
						const menus = transAside(res)
						that.sideMenus = menus
						if (this.topmenuActive !== 0 && menus.length) {
							let jumName: any = ''
							if (menus[0]?.children && menus[0]?.children?.length) {
								jumName = menus[0]['children'][0].name
							} else {
								jumName = menus[0]['name']
							}
							router.push({ name: jumName })
						}
						resolve(true)
					})
					.catch(() => {
						reject(false)
					})
			})
		},

		/**
		 * +++++++++++++++++++++++++++++++++++++
		 * 设置登录获取验证码倒计时
		 * +++++++++++++++++++++++++++++++++++++
		 * **/
		SET_SMS_DURATION(countdown: number) {
			this.loginGetSmsDuration = countdown
		},

		/**
		 * +++++++++++++++++++++++++++++++++++++
		 * 设置忘记密码验证码倒计时
		 * +++++++++++++++++++++++++++++++++++++
		 * **/
		SET_SMS_FORGET_DURATION(countdown: number) {
			this.forgetSmsDuration = countdown
		}
	},
	getters: {
		themeColor(): string {
			if (this.theme) return this.theme
			const themeColor = localStorage.getItem(theme_key)
			const theme = themeColor || default_theme_color
			// @ts-ignore
			this.SET_THEME(theme)
			return theme
		}
	}
})
