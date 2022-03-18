<!--轮播图-->
<template>
	<div class="el-card is-always-shadow tadmin-h-full" ref="parent">
		<el-carousel :height="height">
			<el-carousel-item v-for="item in sliderData" :key="item" class="tadmin-overflow-hidden">
				<el-image :src="item" class="tadmin-w-full tadmin-h-full" />
			</el-carousel-item>
		</el-carousel>
	</div>
</template>

<script lang="ts" setup>
const sliderData = ref<string[]>(['http://p3-armor.byteimg.com/tos-cn-i-49unhts6dw/665106f4bbd2a2df96eaf7aec52f7bc3.jpg~tplv-49unhts6dw-image.image', 'http://p3-armor.byteimg.com/tos-cn-i-49unhts6dw/ea095a2c9c72b5d8f2f2818040db736d.jpg~tplv-49unhts6dw-image.image', 'http://p3-armor.byteimg.com/tos-cn-i-49unhts6dw/b557ff0cd44146a2e471b477af2f30d0.jpg~tplv-49unhts6dw-image.image'])
const height = ref<string>('')
const parent = ref()

onMounted(() => {
	height.value = parent.value.offsetHeight + 'px'
})
</script>
