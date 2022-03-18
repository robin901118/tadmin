/**
 * ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
 * 通用状态
 * ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
 * **/
import { getUserInfo } from '@/api/system/login'
import { removeToken } from '@/utils/auth'
import { useRouterStore } from './router'
import { useAppStore } from './app'

export const useUserStore = defineStore({
	id: 'user',
	state: () => ({
		// 授权路由
		authRoutes: [],
		//账号
		account: '',
		//生日
		birthday: '',
		//邮箱
		email: '',
		//真实姓名
		realName: '',
		//性别
		sex: 0,
		//用户状态
		status: 0,
		//租户id
		tenantId: '',
		//租户名称
		tenantName: '',
		//用户类型
		userType: '',
		//头像
		avatar: '',
		//用户id
		userId: 0,
		//用户手机号
		phone: '',
		//昵称
		name: '',
		//角色id
		roleIds: [],
		//顶部菜单
		topmenus: [],
		//是否是超级用户
		isSuper: 0,
		//用户拥有的授权标识集合
		grantCodeList: []
	}),
	actions: {
		/**
		 * +++++++++++++++++++++++++++++++++++++
		 * 获取用户信息
		 * +++++++++++++++++++++++++++++++++++++
		 * **/
		GET_USER_INFO(): Promise<any> {
			const that = this
			const appStore = useAppStore()
			return new Promise(async (resolve, reject) => {
				try {
					const { userInfo, menuList, grantCodeList } = await getUserInfo()
					if (userInfo) {
						that.account = userInfo.account
						that.birthday = userInfo.birthday
						that.email = userInfo.email
						that.realName = userInfo.realName
						that.sex = userInfo.sex
						that.status = userInfo.status
						that.tenantId = userInfo.tenantId
						that.tenantName = userInfo.tenantName
						that.userType = userInfo.userType
						that.avatar = userInfo.avatar
						that.userId = userInfo.userId
						that.phone = userInfo.phone
						that.name = userInfo.name
						that.roleIds = userInfo.roleIds?.split(',') || []
						that.authRoutes = menuList || []
						that.topmenus = userInfo.topmenus
						that.isSuper = userInfo.isSuper
						that.grantCodeList = grantCodeList || []
						resolve(menuList)
					} else {
						reject(false)
					}
				} catch (e) {
					console.error(e)
					reject(false)
				}
			})
		},

		/**
		 * +++++++++++++++++++++++++++++++++++++
		 * 退出登录
		 * +++++++++++++++++++++++++++++++++++++
		 * **/
		USER_LOGOUT(): Promise<boolean> {
			const that = this
			const routerStore = useRouterStore()
			const appStore = useAppStore()
			return new Promise(resolve => {
				that.$reset()
				routerStore.$reset()
				appStore.topmenuActive = '0'
				appStore.sideMenus = []
				removeToken()
				resolve(true)
			})
		}
	},
	getters: {
		//获取授权标识
		permission(): Set<string> {
			return new Set(this.grantCodeList)
		}
	}
})
