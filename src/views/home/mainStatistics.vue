<!--统计-->
<template>
	<el-card>
		<template #header>
			<h3 class="cardTitle">欢迎回来，{{ userStore.name }}</h3>
		</template>
		<el-row>
			<el-col :span="6" v-for="item in statistics" :key="item.label">
				<div class="tadmin-h-[100px] tadmin-flex tadmin-items-center">
					<el-avatar :src="item.icon"></el-avatar>
					<div class="tadmin-ml-[1em] tadmin-text-333 dark:tadmin-text-white">
						<h5 class="tadmin-font-normal tadmin-mb-10">{{ item.label }}</h5>
						<span class="tadmin-text-25 tadmin-align-sub">{{ item.value }}</span>
						<sub class="tadmin-ml-[0.5em]">{{ item.unit }}</sub>
					</div>
				</div>
			</el-col>
		</el-row>
		<el-divider />
		<div class="flexJustify tadmin-mb-20">
			<h3 class="cardTitle">内容数据</h3>
		</div>
		<v-chart class="tadmin-h-[210px]" autoresize :option="option" />
	</el-card>
</template>

<script lang="ts" setup>
import { isDark } from '@/utils/common'
import { useUserStore } from '@/store/user'

//用户中心实例
const userStore = useUserStore()
//统计内容
const statistics = ref([
	{ label: '线上总内容', value: '375', unit: '个', icon: 'http://p3-armor.byteimg.com/tos-cn-i-49unhts6dw/288b89194e657603ff40db39e8072640.svg~tplv-49unhts6dw-image.image' },
	{ label: '投放中内容', value: '375', unit: '个', icon: 'http://p3-armor.byteimg.com/tos-cn-i-49unhts6dw/bf579bf45e307c554c7526da1ba56710.svg~tplv-49unhts6dw-image.image' },
	{ label: '日新增评论', value: '8874', unit: '个', icon: 'http://p3-armor.byteimg.com/tos-cn-i-49unhts6dw/77d74c9a245adeae1ec7fb5d4539738d.svg~tplv-49unhts6dw-image.image' },
	{ label: '较昨日新增', value: '25.8', unit: '%', icon: 'http://p3-armor.byteimg.com/tos-cn-i-49unhts6dw/c8b36e26d2b9bb5dbf9b74dd6d7345af.svg~tplv-49unhts6dw-image.image' }
])
//图表数据
const borderColor = isDark() ? '#1F2739' : '#F2F3F5'
const textColor = isDark() ? 'white' : '#333'
const option = reactive({
	tooltip: {
		trigger: 'axis',
		axisPointer: {
			type: 'cross',
			label: {
				backgroundColor: '#6a7985'
			}
		}
	},
	grid: {
		left: 0,
		right: '2%',
		top: 10,
		bottom: 0,
		containLabel: true
	},
	xAxis: {
		type: 'category',
		boundaryGap: false,
		data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
		axisLine: {
			lineStyle: {
				color: borderColor
			}
		},
		axisLabel: {
			color: textColor
		},
		axisTick: {
			show: false
		}
	},
	yAxis: {
		type: 'value',
		splitLine: {
			lineStyle: {
				color: borderColor,
				type: 'dashed'
			}
		},
		axisLabel: {
			color: textColor
		}
	},
	series: [
		{
			data: [600, 932, 600, 934, 600, 1330, 500],
			type: 'line',
			smooth: true,
			areaStyle: {
				color: {
					type: 'linear',
					x: 0,
					y: 0,
					x2: 0,
					y2: 1,
					colorStops: [
						{
							offset: 0,
							color: '#bbedff' // 0% 处的颜色
						},
						{
							offset: 1,
							color: 'rgba(187,237,255,0)' // 100% 处的颜色
						}
					]
				}
			},
			showSymbol: false,
			emphasis: {
				focus: 'series'
			},
			lineStyle: {
				color: {
					type: 'linear',
					x: 0,
					y: 1,
					x2: 1,
					y2: 0,
					colorStops: [
						{
							offset: 0,
							color: '#1EE5FF' // 0% 处的颜色
						},
						{
							offset: 1,
							color: '#6E43FB' // 100% 处的颜色
						}
					]
				},
				width: 3
			}
		}
	]
})
</script>

<style lang="scss" scoped>
::v-deep(.el-avatar) {
	background: #ececec;
}
</style>
