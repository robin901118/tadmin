<!--快捷菜单-->
<template>
	<el-card>
		<template #header>
			<div class="flexJustify">
				<h3 class="cardTitle">快捷操作</h3>
			</div>
		</template>
		<ul class="tadmin-grid tadmin-grid-cols-3 tadmin-gap-5">
			<li v-for="item in menus" class="tadmin-list-none flexCenter tadmin-flex-col tadmin-h-[90px] tadmin-cursor-pointer tadmin-text-333 liHover dark:tadmin-text-white">
				<div class="tadmin-w-32 tadmin-h-32 tadmin-rounded-4 tadmin-bg-[#F7F8FA] flexCenter tadmin-mb-10 dark:tadmin-bg-darkBlueLight">
					<el-icon>
						<component :is="item.icon" />
					</el-icon>
				</div>
				<p class="tadmin-text-14">{{ item.label }}</p>
			</li>
		</ul>
	</el-card>
</template>

<script lang="ts" setup>
const menus = ref([
	{ icon: 'Box', label: '内容管理' },
	{ icon: 'DataAnalysis', label: '内容分析' },
	{ icon: 'Discount', label: '高级管理' },
	{ icon: 'ChatLineSquare', label: '线上推广' },
	{ icon: 'Document', label: '内容投放' }
])
</script>

<style lang="scss" scoped>
.liHover:hover {
	color: var(--el-color-primary);
}
</style>
