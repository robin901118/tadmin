<!--表格上面那种已选xxx条的 alert 块-->
<template>
	<div class="tadmin-pl-[2em] block primary">
		<slot></slot>
	</div>
</template>

<style lang="scss" scoped>
.block {
	@apply tadmin-flex tadmin-items-center tadmin-h-40 tadmin-text-16;
}
.primary {
	@apply tadmin-rounded-4;
	border: 1px solid var(--el-color-primary);
	background: var(--el-color-primary-light-9);
}
</style>
