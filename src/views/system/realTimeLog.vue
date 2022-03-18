<template>
	<div class="tadmin-p-20 tadmin-h-[100vh]">
		<h1 class="tadmin-text-20 tadmin-mb-20">{{ '当前日志：' + (path || 'N/A') }}</h1>
		<div class="tadmin-mb-20 tadmin-flex tadmin-items-center">
			<span class="tadmin-mr-[1em]">关键词高亮</span>
			<el-input placeholder="输入关键词，将在下个日志进行高亮" v-model="keywords" class="tadmin-w-1/3 tadmin-mr-[1em]" />
			<el-button type="danger" @click="onStop" v-if="isPlay" icon="VideoPause">停止</el-button>
			<el-button type="success" @click="onPlay" v-else icon="VideoPlay">开启</el-button>
			<el-button type="primary" @click="onClear" icon="Coffee">清屏</el-button>
		</div>

		<div class="tadmin-h-[89%] tadmin-bg-black tadmin-text-white tadmin-p-5">
			<DynamicScroller :items="items" :min-item-size="32" class="tadmin-h-full scrollNone" ref="dynamicScroll">
				<template #default="{ item, index, active }">
					<DynamicScrollerItem :item="item" :size-dependencies="[item.id]" :active="active" :data-index="index" :data-active="active">
						<p v-html="item.msg"></p>
					</DynamicScrollerItem>
				</template>
			</DynamicScroller>
		</div>
	</div>
</template>

<script lang="ts" setup>
const items = ref([])
//虚拟滚动实例
const dynamicScroll = ref()
//关键词
const keywords = ref<string>('')
//是否在播放
const isPlay = ref<boolean>(true)
//websocket实例
let socket: any = null
//路由参数实例
const route = useRoute()
const path = computed(() => {
	return route?.query?.path || ''
})

/**
 * ++++++++++++++++++++++++++++++++++++++++
 * 对关键词进行标注
 * ++++++++++++++++++++++++++++++++++++++++
 * **/
function addKeywordsTag(str: string) {
	return str.replaceAll(keywords.value, `<span style="background-color: orange;color:white">${keywords.value}</span>`)
}

/**
 * ++++++++++++++++++++++++++++++++++++++++
 * 开始自动播放
 * ++++++++++++++++++++++++++++++++++++++++
 * **/
function onPlay() {
	console.log('开始')
	isPlay.value = true
	initSocket()
}

/**
 * ++++++++++++++++++++++++++++++++++++++++
 * 停止播放
 * ++++++++++++++++++++++++++++++++++++++++
 * **/
function onStop() {
	isPlay.value = false
	socket && socket.close()
}

/**
 * ++++++++++++++++++++++++++++++++++++++++
 * 清屏
 * ++++++++++++++++++++++++++++++++++++++++
 * **/
function onClear() {
	items.value = []
}

/**
 * ++++++++++++++++++++++++++++++++++++++++
 * 实例化socket
 * ++++++++++++++++++++++++++++++++++++++++
 * **/
async function initSocket() {
	if (!path.value) return
	let baseURL: string = await import.meta.env.VITE_APP_BASE_API
	baseURL = baseURL.replace(/^https?\:\/\//i, '')
	socket = new WebSocket(`ws://${baseURL}/websocket/logging`)
	socket.onopen = function (e) {
		socket.send(path.value)
	}
	socket.onclose = onStop
	socket.onerror = onStop
	// 接收服务器的消息
	socket.onmessage = function (e) {
		let msg: any = e.data || ''
		keywords.value && (msg = addKeywordsTag(msg))
		if (!msg) return
		items.value.push({
			id: +new Date(),
			msg
		})
		dynamicScroll.value.scrollToBottom()
	}
}
onMounted(() => {
	onPlay()
	//@ts-ignore
	document.title = path.value
})
onBeforeUnmount(() => {
	onStop()
	onClear()
	socket = null
})
</script>

<style lang="scss" scoped>
.scrollNone {
	&::-webkit-scrollbar {
		display: none;
	}
}
</style>
