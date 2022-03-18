<template>
	<template v-for="item in props.menus" :key="nanoid()">
		<template v-if="item.meta.routeStatus === 1">
			<!-- 有子菜单 -->
			<template v-if="item?.children?.length">
				<el-sub-menu :index="item.path">
					<template #title>
						<el-icon v-if="item.meta.menuIcon">
							<component :is="item.meta.menuIcon" />
						</el-icon>
						<span v-else class="tadmin-inline-block tadmin-w-[0.8em]"></span>
						<span class="truncate tadmin-w-[148px]">{{ item.meta.menuName }}</span>
					</template>
					<my-sub-menu :menus="item.children" :base-path="item.path" />
				</el-sub-menu>
			</template>

			<!-- 没有子菜单 -->
			<el-menu-item v-else v-bind="transBindObj(item)">
				<el-icon v-if="item.meta.menuIcon">
					<component :is="item.meta.menuIcon" />
				</el-icon>
				<span v-else class="tadmin-inline-block tadmin-w-[0.8em]"></span>
				<span>{{ item.meta.menuName }}</span>
			</el-menu-item>
		</template>
	</template>
</template>

<script lang="ts" setup name="MySubMenu">
import { nanoid } from 'nanoid'
import path from 'path-browserify'
import type { AllRouter } from '@/api/system/menu'

const props = defineProps({
	menus: {
		type: Object,
		default: () => []
	},
	basePath: {
		type: String,
		default: '/'
	}
})
const router = useRouter()
function isExternal(path: string): boolean {
	return /^(https?:|mailto:|tel:)/.test(path)
}
function resolvePath(routePath: string, basePath: string) {
	if (isExternal(routePath)) {
		return routePath
	}
	if (isExternal(basePath)) {
		return basePath
	}
	return path.resolve(basePath, routePath)
}

function transBindObj(item: AllRouter) {
	const obj: any = {}
	const transPath = resolvePath(item.path, props.basePath)
	obj.index = transPath
	obj.onClick = () => {
		if (item.meta.isOutLinks === 1) {
			window.open(transPath, '__blank')
			router.push({
				path: '/outLink/index',
				query: {
					redirect: transPath
				}
			})
		} else {
			router.push(transPath)
		}
	}
	return obj
}
</script>

<style lang="scss" scoped></style>
