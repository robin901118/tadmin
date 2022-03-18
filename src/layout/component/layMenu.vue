<template>
	<div>
		<template v-if="appStore.sideMenus && appStore.sideMenus.length">
			<el-menu :collapse="appStore.asideIsCollapse" style="border-right: none" class="beautyScroll tadmin-overflow-y-auto tadmin-h-full tadmin-p-4 tadmin-box-border" :default-active="route.path">
				<my-sub-menu :menus="appStore.sideMenus" />
			</el-menu>
			<el-button @click="appStore.SET_SIDE_COLLAPSE(!appStore.asideIsCollapse)" circle :icon="appStore.asideIsCollapse ? 'Expand' : 'Fold'" class="tadmin-absolute tadmin-right-16 tadmin-bottom-10" />
		</template>
		<div v-else class="tadmin-flex tadmin-justify-center tadmin-w-[218px]">
			<el-empty description="空空如也~" :image-size="100" />
		</div>
	</div>
</template>

<script lang="ts" setup>
import { useAppStore } from '@/store/app'
import MySubMenu from './mySubMenu.vue'
//路由
const router = useRouter()
const route = useRoute()
//app实例
const appStore = useAppStore()
</script>

<style lang="scss" scoped>
.truncate {
	@apply tadmin-truncate tadmin-flex-1;
	max-width: 80%;
}
</style>
