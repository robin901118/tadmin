<!--线上热门内容-->
<template>
	<el-card>
		<template #header>
			<div class="flexJustify">
				<h3 class="cardTitle">线上热门内容</h3>
			</div>
		</template>
		<el-radio-group v-model="tableType" size="small">
			<el-radio-button label="文本"></el-radio-button>
			<el-radio-button label="图片"></el-radio-button>
			<el-radio-button label="视频"></el-radio-button>
		</el-radio-group>
		<el-table size="small" class="tadmin-mt-20" v-loading="requestLoading" :data="tableData">
			<el-table-column label="排名" prop="rank" align="center" width="80"></el-table-column>
			<el-table-column label="内容标题" prop="content"></el-table-column>
			<el-table-column label="点击量" prop="clickNumber" width="100"></el-table-column>
			<el-table-column label="日涨幅" width="100">
				<template #default="scope">{{ scope.row.rate }}%</template>
			</el-table-column>
		</el-table>
	</el-card>
</template>

<script lang="ts" setup>
import Mock from 'mockjs'

interface HotContent {
	rank: number
	content: string
	clickNumber: number | string
	rate: number | string
}

const tableData: Array<HotContent> = []
const tableType = ref<string>('文本')
const requestLoading = ref<boolean>(false)
for (let i = 1; i < 6; i++) {
	tableData.push(
		Mock.mock({
			rank: i,
			content: '@cparagraph(1)',
			clickNumber: '@integer(1000,10000)',
			rate: '@integer(1,100)'
		} as HotContent)
	)
}
</script>
