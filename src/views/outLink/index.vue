<template>
	<div class="tadmin-h-[100vh] tadmin-flex tadmin-justify-center tadmin-items-center">
		<el-result icon="info" title="外链页面" sub-title="当前打开的页面是外链">
			<template #extra>
				<el-button type="primary" @click="openAgain">重新打开</el-button>
			</template>
		</el-result>
	</div>
</template>

<script setup lang="ts">
import { ElMessage } from 'element-plus'
const router = useRouter()
const route = useRoute()

function openAgain() {
	const url = route.query?.redirect as string
	if (url) {
		window.open(url, '__blank')
	} else {
		ElMessage({
			type: 'error',
			message: '外链丢失'
		})
	}
}
</script>
