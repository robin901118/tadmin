<template>
	<router-view v-slot="{ Component }" v-if="showRouterView">
		<component :is="Component" class="Router" />
	</router-view>
</template>

<script lang="ts" setup>
//显示、隐藏router-view
const showRouterView = ref<boolean>(true)
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
//路由跳转样式
.Router {
	position: relative;
	overflow-x: hidden;
	width: 100%;
	overflow-y: auto;
	padding: 10px;
}
</style>
