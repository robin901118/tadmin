<template>
	<el-config-provider :locale="zhCn">
		<router-view v-slot="{ Component }">
			<component :is="Component" />
		</router-view>
	</el-config-provider>
</template>

<script setup lang="ts">
import zhCn from 'element-plus/lib/locale/lang/zh-cn'
import { ElConfigProvider, ElMessage } from 'element-plus'
import { getCatchDict } from '@/api/system/dict'
import { theme_key, catch_dict_key } from '@/config'

//设置主题颜色
import { useAppStore } from '@/store/app'
const appStore = useAppStore()
const catchColor = localStorage.getItem(theme_key)
catchColor && appStore.SET_THEME(catchColor)

/**
 * +++++++++++++++++++++++++++++++++++++++++
 * 设置字典缓存
 * @param msg 是否显示结果弹窗 default:false
 * +++++++++++++++++++++++++++++++++++++++++
 * **/
function setDictCatch(msg = false): Promise<boolean> {
	return new Promise((resolve, reject) => {
		getCatchDict()
			.then(res => {
				res && localStorage.setItem(catch_dict_key, JSON.stringify(res))
			})
			.then(() => {
				msg && ElMessage({ type: 'success', message: '刷新成功' })
				resolve(true)
			})
			.catch(() => {
				msg && ElMessage({ type: 'error', message: '刷新失败' })
				reject(false)
			})
	})
}
provide('setDictCatch', setDictCatch)
</script>
