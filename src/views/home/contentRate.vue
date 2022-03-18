<!--内容类型占比-->
<template>
	<el-card>
		<template #header>
			<h3 class="cardTitle">内容类型占比</h3>
		</template>
		<v-chart class="tadmin-h-[250px]" autoresize :option="option" />
	</el-card>
</template>

<script lang="ts" setup>
import { isDark } from '@/utils/common'
const option = reactive({
	tooltip: {
		trigger: 'item'
	},
	legend: {
		bottom: 0,
		left: 'center',
		icon: 'circle',
		textStyle: {
			color: isDark() ? 'white' : '#333'
		}
	},
	series: [
		{
			type: 'pie',
			radius: ['50%', '70%'],
			avoidLabelOverlap: false,
			top: '-10%',
			data: [
				{ value: 1048, name: '视频类', itemStyle: { color: '#21CCFF' } },
				{ value: 735, name: '图文类', itemStyle: { color: '#313CA9' } },
				{ value: 580, name: '纯文本', itemStyle: { color: '#249EFF' } }
			]
		}
	]
})
</script>
