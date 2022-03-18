<template>
	<lay-header />
	<el-container style="height: calc(100vh - 60px)">
		<lay-side />
		<el-container direction="vertical">
			<div style="border-left: 1px solid var(--el-border-color-base)" class="dark:tadmin-bg-darkBlue">
				<el-tabs v-model="routerActive" type="card" @tab-remove="onTabClose">
					<el-tab-pane v-for="item in routerStore.routerHistory" :key="item.name" :label="item.title" :name="item.name" :closable="item.closable">
						<template #label>
							<span @contextmenu.prevent="rightClick($event, item.name)" @click.middle="onClickMiddle(item.path)" class="tadmin-inline-block tadmin-h-full">{{ item.title }}</span>
						</template>
					</el-tab-pane>
				</el-tabs>
				<vue3-menus :open="open" :event="eventVal" :menus="menus">
					<template #icon="{ menu, index, activeIndex }">
						<el-icon :size="17">
							<component :is="menu.icon" />
						</el-icon>
					</template>
				</vue3-menus>
			</div>
			<el-main class="tadmin-bg-[#F0F2F5] tadmin-shadow-inner dark:tadmin-bg-[#182132] tadmin-overflow-x-hidden tadmin-relative beautyScroll" style="scroll-behavior: smooth">
				<router-view v-slot="{ Component }" v-if="showRouterView">
					<transition name="router_animate">
						<component :is="Component" class="Router" />
					</transition>
				</router-view>
			</el-main>
		</el-container>
	</el-container>
</template>

<script setup lang="ts">
import laySide from './component/laySide.vue'
import layHeader from './component/layHeader.vue'
import { useRouterStore } from '@/store/router'

//路由实例
const router = useRouter()
//路由状态管理器实例
const routerStore = useRouterStore()
//点击历史记录
const routerActive = computed({
	get() {
		return routerStore.activeRouterPath
	},
	set(value: string) {
		routerStore.SET_ROUTER_ACTIVE(value)
		router.push(value)
	}
})
//显示、隐藏router-view
const showRouterView = ref<boolean>(true)
//右键菜单配置
const open = ref<boolean>(false)
const rightClickPath = ref<string>('')
const eventVal = ref<Event | {}>({})
const menus = ref([
	{
		label: '刷新',
		icon: 'Refresh',
		click: () => {
			if (routerStore.activeRouterPath === rightClickPath.value) {
				//如果当前tab就是当前页，则直接刷新
				onRefreshView()
			} else {
				//否则打开对应的页面
				routerStore.SET_ROUTER_ACTIVE(rightClickPath.value)
			}
		}
	},
	{
		label: '关闭',
		icon: 'Close',
		click: () => onTabClose(rightClickPath.value)
	},
	{
		label: '关闭其他',
		icon: 'CircleClose',
		click: () => routerStore.DEL_ROUTER_APART_SELF(rightClickPath.value)
	},
	{
		label: '全部关闭',
		icon: 'FolderDelete',
		click: () => routerStore.DEL_ALL_ROUTER()
	}
])

/**
 * +++++++++++++++++++++++++++++++++
 * 点击右键菜单
 * +++++++++++++++++++++++++++++++++
 * **/
function rightClick(e: Event, name: string) {
	open.value = false
	nextTick(() => {
		rightClickPath.value = name
		eventVal.value = e
		open.value = true
	})
	e.preventDefault()
}

/**
 * +++++++++++++++++++++++++++++++++
 * 点击鼠标中键
 * +++++++++++++++++++++++++++++++++
 * **/
function onClickMiddle(path: string) {
	onTabClose(path)
}

/**
 * +++++++++++++++++++++++++++++++++
 * 关闭tab
 * +++++++++++++++++++++++++++++++++
 * **/
function onTabClose(name: string) {
	routerStore.DEL_ROUTER_HISTORY(name)
}

/**
 * +++++++++++++++++++++++++++++++++
 * 重新刷新当前组件
 * +++++++++++++++++++++++++++++++++
 * **/
//给子组件使用
provide('onRefreshView', onRefreshView)
function onRefreshView() {
	showRouterView.value = false
	nextTick(() => {
		showRouterView.value = true
	})
}
</script>

<style lang="scss" scoped>
::v-deep(.el-tabs__header) {
	margin: 0;
}

::v-deep(.el-tabs--card) {
	> .el-tabs__header {
		.el-tabs__nav {
			border: none;
		}

		.el-tabs__item {
			border: none;

			&.is-active {
				border-bottom: 2px solid var(--el-color-primary);
			}
		}
	}
}

//路由跳转样式
.Router {
	position: absolute;
	left: 0;
	top: 0;
	overflow-x: hidden;
	width: 100%;
	overflow-y: auto;
	padding: 10px;
}

//入场动画
@keyframes fade-in-bottom {
	0% {
		transform: translate3d(0, 50px, 0);
		opacity: 0;
	}
	100% {
		transform: translate3d(0, 0, 0);
		opacity: 1;
	}
}

//出场动画
@keyframes fade-out-top {
	0% {
		transform: translate3d(0, 0, 0);
		opacity: 1;
	}
	100% {
		transform: translate3d(0, -50px, 0);
		opacity: 0;
	}
}

.router_animate-enter-active {
	animation: fade-in-bottom 0.4s cubic-bezier(0.39, 0.575, 0.565, 1) both;
}

.router_animate-leave-active {
	animation: fade-out-top 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
}
</style>
