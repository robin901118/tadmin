<!--公告-->
<template>
	<el-card>
		<template #header>
			<div class="flexJustify">
				<h3 class="cardTitle">公告</h3>
			</div>
		</template>
		<ul class="tadmin-list-none notifyList">
			<li v-for="(item, index) in notify" :key="index" class="tadmin-flex tadmin-items-center tadmin-h-30 tadmin-cursor-pointer tadmin-text-333 liHover dark:tadmin-text-white">
				<el-tag size="small" :type="transTagType(item.tag)">{{ item.tag }}</el-tag>
				<p class="tadmin-flex-1 tadmin-text-ellipsis tadmin-ml-[0.5em] tadmin-text-14 tadmin-overflow-hidden tadmin-whitespace-nowrap">{{ item.content }}</p>
			</li>
		</ul>
	</el-card>
</template>

<script lang="ts" setup>
const notify = ref([
	{ tag: '活动', content: '内容最新优惠活动快来参与，快来啊' },
	{ tag: '消息', content: '新增内容尚未通过审核，更改后请重新发起审核' },
	{ tag: '通知', content: '上月运营周报，点击查看' },
	{ tag: '通知', content: '1月新系统升级计划通过' },
	{ tag: '消息', content: '新增内容尚已通过审核，点击查看' },
	{ tag: '活动', content: '内容最新优惠活动快来参与，快来啊' },
	{ tag: '消息', content: '新增内容尚未通过审核，更改后请重新发起审核' }
])

/**
 * ++++++++++++++++++++++++++++++++++++++++++++
 * 转换tag的类型
 * ++++++++++++++++++++++++++++++++++++++++++++
 * **/
function transTagType(tag: string): string {
	switch (tag) {
		case '活动':
			return ''

		case '消息':
			return 'success'

		case '通知':
			return 'warning'
	}
}
</script>

<style scoped lang="scss">
.liHover:hover {
	color: var(--el-color-primary);
}
</style>
