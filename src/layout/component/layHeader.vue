<template>
	<el-header class="flexJustify elHeader dark:tadmin-bg-darkBlue">
		<div class="flexCenter">
			<div class="tadmin-flex tadmin-items-center tadmin-cursor-pointer" @click="router.push('/')">
				<svg t="1642136291869" class="icon tadmin-mr-[0.5em]" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1005" width="50" height="50">
					<path d="M64 836.2624S186.4576 179.2 344.7424 179.2c131.4176 0 125.44 238.9376 224 238.9376 98.56 0 80.64-122.4576 185.1776-122.4576 164.2624 0 206.08 537.6 206.08 537.6H64v2.9824z" p-id="1006" style="fill: var(--el-color-primary); opacity: 0.5"></path>
					<path d="M64 836.2624S186.4576 510.72 344.7424 510.72c131.4176 0 125.44 119.4624 224 119.4624 98.56 0 80.64-59.7248 185.1776-59.7248 164.2624 0 206.08 268.8 206.08 268.8H64v-2.9952z" p-id="1007" data-spm-anchor-id="a313x.7781069.0.i0" class="selected" style="fill: var(--el-color-primary)"></path>
				</svg>
				<span class="tadmin-text-20 tadmin-mr-[3em] tadmin-hidden md:tadmin-block" style="color: var(--el-color-primary)">T-Admin 管理平台</span>
			</div>
			<breadcrumb class="tadmin-hidden lg:tadmin-block" />
			<span class="md:tadmin-hidden lg:tadmin-hidden">
				<el-popover :width="500">
					<template #reference>
						<el-button icon="Menu" circle />
					</template>
					<el-radio-group v-model="activeIndex">
						<el-radio label="0" border>全部</el-radio>
						<el-radio :label="item.topmenuId.toString()" border v-for="item in userStore.topmenus">
							{{ item.topmenuName }}
						</el-radio>
					</el-radio-group>
					<lay-menu />
				</el-popover>
			</span>
		</div>
		<div class="flexCenter">
			<span class="tadmin-hidden md:tadmin-block">
				<el-color-picker v-model="systemColor" />
				<el-tooltip :content="isDark ? '明亮模式' : '黑暗模式'">
					<el-switch :model-value="isDark" inline-prompt active-icon="Moon" inactive-icon="Sunny" @change="toggleDarkHandle" class="tadmin-mx-[1em]" />
				</el-tooltip>
				<span class="tadmin-mr-[1em]">
					<el-tooltip content="全屏切换" placement="bottom">
						<el-button circle @click="toggle" class="circleBtn">
							<svg t="1641533597325" viewBox="0 0 1024 1024" class="tadmin-w-14 tadmin-h-20" v-show="!isFullscreen">
								<path
									d="M149.333333 394.666667c17.066667 0 32-14.933333 32-32v-136.533334l187.733334 187.733334c6.4 6.4 14.933333 8.533333 23.466666 8.533333s17.066667-2.133333 23.466667-8.533333c12.8-12.8 12.8-32 0-44.8l-187.733333-187.733334H362.666667c17.066667 0 32-14.933333 32-32s-14.933333-32-32-32H149.333333c-4.266667 0-8.533333 0-10.666666 2.133334-8.533333 4.266667-14.933333 10.666667-19.2 17.066666-2.133333 4.266667-2.133333 8.533333-2.133334 12.8v213.333334c0 17.066667 14.933333 32 32 32zM874.666667 629.333333c-17.066667 0-32 14.933333-32 32v136.533334L642.133333 597.333333c-12.8-12.8-32-12.8-44.8 0s-12.8 32 0 44.8l200.533334 200.533334H661.333333c-17.066667 0-32 14.933333-32 32s14.933333 32 32 32h213.333334c4.266667 0 8.533333 0 10.666666-2.133334 8.533333-4.266667 14.933333-8.533333 17.066667-17.066666 2.133333-4.266667 2.133333-8.533333 2.133333-10.666667V661.333333c2.133333-17.066667-12.8-32-29.866666-32zM381.866667 595.2l-200.533334 200.533333V661.333333c0-17.066667-14.933333-32-32-32s-32 14.933333-32 32v213.333334c0 4.266667 0 8.533333 2.133334 10.666666 4.266667 8.533333 8.533333 14.933333 17.066666 17.066667 4.266667 2.133333 8.533333 2.133333 10.666667 2.133333h213.333333c17.066667 0 32-14.933333 32-32s-14.933333-32-32-32h-136.533333l200.533333-200.533333c12.8-12.8 12.8-32 0-44.8s-29.866667-10.666667-42.666666 0zM904.533333 138.666667c0-2.133333 0-2.133333 0 0-4.266667-8.533333-10.666667-14.933333-17.066666-17.066667-4.266667-2.133333-8.533333-2.133333-10.666667-2.133333H661.333333c-17.066667 0-32 14.933333-32 32s14.933333 32 32 32h136.533334l-187.733334 187.733333c-12.8 12.8-12.8 32 0 44.8 6.4 6.4 14.933333 8.533333 23.466667 8.533333s17.066667-2.133333 23.466667-8.533333l187.733333-187.733333V362.666667c0 17.066667 14.933333 32 32 32s32-14.933333 32-32V149.333333c-2.133333-4.266667-2.133333-8.533333-4.266667-10.666666z"
								></path>
							</svg>
							<svg t="1641533617518" viewBox="0 0 1024 1024" class="tadmin-w-14 tadmin-h-20" fill="#999" v-show="isFullscreen">
								<path
									d="M313.6 358.4H177.066667c-17.066667 0-32 14.933333-32 32s14.933333 32 32 32h213.333333c4.266667 0 8.533333 0 10.666667-2.133333 8.533333-4.266667 14.933333-8.533333 17.066666-17.066667 2.133333-4.266667 2.133333-8.533333 2.133334-10.666667v-213.333333c0-17.066667-14.933333-32-32-32s-32 14.933333-32 32v136.533333L172.8 125.866667c-12.8-12.8-32-12.8-44.8 0-12.8 12.8-12.8 32 0 44.8l185.6 187.733333zM695.466667 650.666667H832c17.066667 0 32-14.933333 32-32s-14.933333-32-32-32H618.666667c-4.266667 0-8.533333 0-10.666667 2.133333-8.533333 4.266667-14.933333 8.533333-17.066667 17.066667-2.133333 4.266667-2.133333 8.533333-2.133333 10.666666v213.333334c0 17.066667 14.933333 32 32 32s32-14.933333 32-32v-136.533334l200.533333 200.533334c6.4 6.4 14.933333 8.533333 23.466667 8.533333s17.066667-2.133333 23.466667-8.533333c12.8-12.8 12.8-32 0-44.8l-204.8-198.4zM435.2 605.866667c-4.266667-8.533333-8.533333-14.933333-17.066667-17.066667-4.266667-2.133333-8.533333-2.133333-10.666666-2.133333H192c-17.066667 0-32 14.933333-32 32s14.933333 32 32 32h136.533333L128 851.2c-12.8 12.8-12.8 32 0 44.8 6.4 6.4 14.933333 8.533333 23.466667 8.533333s17.066667-2.133333 23.466666-8.533333l200.533334-200.533333V832c0 17.066667 14.933333 32 32 32s32-14.933333 32-32V618.666667c-2.133333-4.266667-2.133333-8.533333-4.266667-12.8zM603.733333 403.2c4.266667 8.533333 8.533333 14.933333 17.066667 17.066667 4.266667 2.133333 8.533333 2.133333 10.666667 2.133333h213.333333c17.066667 0 32-14.933333 32-32s-14.933333-32-32-32h-136.533333L896 170.666667c12.8-12.8 12.8-32 0-44.8-12.8-12.8-32-12.8-44.8 0l-187.733333 187.733333V177.066667c0-17.066667-14.933333-32-32-32s-32 14.933333-32 32v213.333333c2.133333 4.266667 2.133333 8.533333 4.266666 12.8z"
									p-id="3283"
								></path>
							</svg>
						</el-button>
					</el-tooltip>
				</span>
			</span>
			<el-dropdown>
				<div class="flexCenter tadmin-mr-[1em] tadmin-cursor-pointer">
					<el-avatar :size="30" :src="userStore.avatar" class="tadmin-shrink-0" />
					<span class="tadmin-text-333 tadmin-text-14 tadmin-ml-[0.5em] tadmin-truncate tadmin-max-w-[10em] dark:tadmin-text-white">欢迎您，{{ userStore.name }}</span>
				</div>
				<template #dropdown>
					<el-dropdown-menu>
						<span class="md:tadmin-hidden lg:tadmin-hidden">
							<el-dropdown-item icon="FullScreen" @click="toggle">全屏切换</el-dropdown-item>
							<el-dropdown-item :icon="isDark ? 'Sunny' : 'Moon'" @click="toggleDarkHandle">{{ isDark ? '切换明亮' : '切换黑暗' }}</el-dropdown-item>
						</span>
						<el-dropdown-item icon="User" @click="router.push('/user?active=baseInfo')">个人中心</el-dropdown-item>
						<el-dropdown-item icon="Lock" @click="router.push('/user?active=psw')">密码设置</el-dropdown-item>
						<el-dropdown-item icon="Refresh" @click="setDictCatch(true)">刷新缓存</el-dropdown-item>
					</el-dropdown-menu>
				</template>
			</el-dropdown>
			<!--大屏模式-->
			<span class="tadmin-hidden md:tadmin-block">
				<el-popconfirm title="现在要退出吗?" confirm-button-text="确定" cancel-button-text="取消" @confirm="onLogout">
					<template #reference>
						<el-button icon="SwitchButton">退出登录</el-button>
					</template>
				</el-popconfirm>
			</span>
			<!--小屏模式-->
			<span class="md:tadmin-hidden lg:tadmin-hidden">
				<el-popconfirm title="现在要退出吗?" confirm-button-text="确定" cancel-button-text="取消" @confirm="onLogout">
					<template #reference>
						<el-button icon="SwitchButton" circle></el-button>
					</template>
				</el-popconfirm>
			</span>
		</div>
	</el-header>
</template>

<script lang="ts" setup>
import { useAppStore } from '@/store/app'
import { useFullscreen, useDark, useToggle } from '@vueuse/core'
import { useUserStore } from '@/store/user'
import { ElMessage } from 'element-plus'
import breadcrumb from './breadcrumb.vue'
import layMenu from './layMenu.vue'

//app实例
const appStore = useAppStore()
//用户中心实例
const userStore = useUserStore()
//路由实例
const router = useRouter()
//全屏
const body = ref<HTMLElement>(document.documentElement)
//黑暗模式
const isDark = useDark({ valueDark: 'tadmin-dark' })
const toggleDark = useToggle(isDark)
const { isFullscreen, toggle } = useFullscreen(body)
//主题色
const freshHandle: any = inject('onRefreshView')
const systemColor = computed({
	get() {
		return appStore.themeColor
	},
	set(nv: string) {
		appStore.SET_THEME(nv)
		//刷新当前页，使当前组件生效
		freshHandle()
	}
})
//字典缓存
const setDictCatch: any = inject('setDictCatch')
const activeIndex = computed({
	get() {
		return appStore.topmenuActive
	},
	set(nv: any) {
		appStore.SET_TOPMENU_ACTIVE(nv.toString())
	}
})

/**
 * ++++++++++++++++++++++++++++++
 * 顶部菜单展开
 * ++++++++++++++++++++++++++++++
 * **/
function collapseChange(topmenuId: number) {
	appStore.SET_TOPMENU_ACTIVE(topmenuId.toString())
}

/**
 * ++++++++++++++++++++++++++++++
 * 退出登录
 * ++++++++++++++++++++++++++++++
 * **/
function onLogout() {
	userStore.USER_LOGOUT().then(() => {
		router.replace('/login')
		ElMessage({
			message: '已退出登录',
			type: 'success'
		})
	})
}

/**
 * ++++++++++++++++++++++++++++++
 * 切换黑暗模式
 * ++++++++++++++++++++++++++++++
 * **/
function toggleDarkHandle() {
	toggleDark()
	freshHandle()
}
</script>

<style lang="scss" scoped>
.elHeader {
	border-bottom: 1px solid var(--el-border-color-base);
	padding-left: 15px;
}
.circleBtn {
	svg {
		fill: var(--el-text-color-regular);
	}
	&:hover svg,
	&:focus svg {
		fill: var(--el-color-primary);
	}
}
</style>
