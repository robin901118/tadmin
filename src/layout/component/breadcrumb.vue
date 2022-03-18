<!--面包屑-->
<template>
	<el-breadcrumb v-if="breadcrumbs.length > 1">
		<el-breadcrumb-item v-for="(item, index) in breadcrumbs" :key="index" :class="{ current: index === breadcrumbs.length - 1 }">
			{{ item.meta.menuName }}
		</el-breadcrumb-item>
	</el-breadcrumb>
</template>

<script lang="ts" setup>
import type { RouteLocationNormalizedLoaded } from 'vue-router'

const router = useRouter()
const route = router.currentRoute // 这里不使用useRoute获取当前路由，否则下面watch监听路由的时候会有警告
const breadcrumbs = ref([])
breadcrumbs.value = getBreadcrumbs(route.value)

watch(
	route,
	newRoute => {
		breadcrumbs.value = getBreadcrumbs(newRoute)
	},
	{ immediate: true }
)

function getBreadcrumbs(route: RouteLocationNormalizedLoaded) {
	const home = [{ path: '/', meta: { menuName: '首页' } }]
	if (route.name === 'Home') {
		return home
	} else {
		const matched = route.matched.filter(item => !!item.meta && !!item.meta.menuName)
		return [...home, ...matched]
	}
}
</script>

<style lang="scss" scoped>
::v-deep(.el-breadcrumb__item.current) {
	.el-breadcrumb__inner {
		color: var(--el-color-primary);
	}
}
</style>
