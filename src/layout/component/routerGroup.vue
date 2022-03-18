<template>
	<div class="tadmin-w-[80px] tadmin-h-full" style="border-right: 1px solid var(--el-border-color-base)">
		<ul class="list tadmin-h-full">
			<li :class="[{ active: activeIndex === '0' }]" @click="onJump(0)">
				<el-icon size="24px">
					<HomeFilled />
				</el-icon>
				<span>全部</span>
			</li>
			<template v-for="item in userStore.topmenus">
				<li @click="onJump(item.topmenuId)" :class="[{ active: activeIndex == item.topmenuId.toString() }]">
					<el-icon size="24px">
						<component :is="item.topmenuIcon" />
					</el-icon>
					<span>{{ item.topmenuName }}</span>
				</li>
			</template>
		</ul>
	</div>
</template>

<script lang="ts" setup name="routerGroup">
import { useAppStore } from '@/store/app'
import { useUserStore } from '@/store/user'
const router = useRouter()
const appStoe = useAppStore()
const userStore = useUserStore()
const activeIndex = computed(() => appStoe.topmenuActive)

/**
 * +++++++++++++++++++++++++++++++++++
 * 点击顶部菜单跳转
 * +++++++++++++++++++++++++++++++++++
 * **/
function onJump(topmenuId: number) {
	appStoe.SET_TOPMENU_ACTIVE(topmenuId.toString())
}
</script>

<style lang="scss" scoped>
.list {
	background-color: var(--el-color-primary-light-3);
	padding: 5px;
	overflow-y: auto;
	&::-webkit-scrollbar {
		display: none;
	}
	> li {
		@apply tadmin-flex tadmin-flex-col tadmin-text-14 tadmin-items-center tadmin-justify-center tadmin-text-center tadmin-cursor-pointer;
		height: 80px;
		color: white;
		border-radius: 4px;
		&:not(:last-child) {
			margin-bottom: 5px;
		}
		&.active,
		&:hover {
			background-color: rgba(255, 255, 255, 0.3);
			color: white;
		}
		> span {
			@apply tadmin-truncate tadmin-w-full tadmin-mt-10;
		}
	}
}
</style>
