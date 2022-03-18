<template>
	<div class="parent">
		<main-statistics class="block-1 tadmin-h-full" />
		<quick-menu class="block-2 tadmin-h-full" />
		<main-slider class="block-3 tadmin-h-full" />
		<hot-content class="block-4 tadmin-h-full" />
		<content-rate class="block-5 tadmin-h-full" />
		<announcement class="block-6 tadmin-h-full" />
	</div>
</template>

<script lang="ts" setup>
import mainStatistics from './mainStatistics.vue'
import mainSlider from './mainSlider.vue'
import quickMenu from './quickMenu.vue'
import announcement from './announcement.vue'
import hotContent from './hotContent.vue'
import contentRate from './contentRate.vue'
</script>

<style lang="scss" scoped>
@media (min-width: 1530px) {
	.parent {
		display: grid;
		grid-template-columns: repeat(5, 1fr);
		grid-template-rows: 0.8fr 0.6fr 1fr;
		grid-column-gap: 10px;
		grid-row-gap: 10px;
	}
	.block-1 {
		grid-area: 1 / 1 / 3 / 5;
	}
	.block-2 {
		grid-area: 1 / 5 / 2 / 6;
	}
	.block-3 {
		grid-area: 2 / 5 / 3 / 6;
	}
	.block-4 {
		grid-area: 3 / 1 / 4 / 3;
	}
	.block-5 {
		grid-area: 3 / 3 / 4 / 5;
	}
	.block-6 {
		grid-area: 3 / 5 / 4 / 6;
	}
}
@media (min-width: 1200px) and (max-width: 1530px) {
	.parent {
		display: grid;
		grid-template-columns: repeat(6, 1fr);
		grid-template-rows: repeat(3, 0.5fr);
		grid-column-gap: 10px;
		grid-row-gap: 10px;
	}

	.block-1 {
		grid-area: 1 / 1 / 3 / 5;
	}
	.block-2 {
		grid-area: 1 / 5 / 2 / 7;
	}
	.block-3 {
		grid-area: 2 / 5 / 3 / 7;
	}
	.block-4 {
		grid-area: 3 / 1 / 4 / 3;
	}
	.block-5 {
		grid-area: 3 / 3 / 4 / 5;
	}
	.block-6 {
		grid-area: 3 / 5 / 4 / 7;
	}
}
@media (max-width: 1199px) {
	.parent {
		display: grid;
		grid-template-columns: repeat(6, 1fr);
		grid-template-rows: repeat(8, 0.5fr);
		grid-column-gap: 10px;
		grid-row-gap: 10px;
	}

	.block-1 {
		grid-area: 1 / 1 / 3 / 7;
	}
	.block-2 {
		grid-area: 3 / 1 / 5 / 4;
	}
	.block-3 {
		grid-area: 3 / 4 / 5 / 7;
	}
	.block-4 {
		grid-area: 5 / 1 / 7 / 7;
	}
	.block-5 {
		grid-area: 7 / 1 / 9 / 4;
	}
	.block-6 {
		grid-area: 7 / 4 / 9 / 7;
	}
}
</style>
