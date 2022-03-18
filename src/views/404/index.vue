<template>
	<div class="tadmin-h-[100vh] tadmin-flex tadmin-justify-center tadmin-items-center">
		<el-result icon="error" title="404" sub-title="当前页面不存在~">
			<template #extra>
				<el-button type="primary" @click="router.replace('/')">返回首页</el-button>
			</template>
		</el-result>
	</div>
</template>

<script setup name="notFond">
const router = useRouter()
</script>
