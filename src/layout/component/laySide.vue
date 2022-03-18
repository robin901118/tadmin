<template>
	<el-aside class="tadmin-relative tadmin-h-full dark:tadmin-bg-darkBlue beautyScroll tadmin-hidden md:tadmin-flex" style="width: auto">
		<router-group v-if="userStore.topmenus.length" />
		<lay-menu />
	</el-aside>
</template>

<script lang="ts" setup>
import { useUserStore } from '@/store/user'
import routerGroup from './routerGroup.vue'
import layMenu from './layMenu.vue'

//user实例
const userStore = useUserStore()
</script>
