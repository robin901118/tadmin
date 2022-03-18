<template>
	<el-row :gutter="10">
		<el-col :span="6" v-for="(item, index) in fullDate" :key="index">
			<div class="tadmin-grid tadmin-grid-cols-7 tadmin-grid-gap-[2px] tadmin-text-12 tadmin-relative" style="grid-template-rows: 40px repeat(6, 80px)">
				<!--周-->
				<div class="tadmin-relative tadmin-z-10 tadmin-text-center tadmin-font-bold tadmin-leading-[40px]" v-for="(week, weekIndex) in weeks" :key="weekIndex">{{ week }}</div>
				<!--日-->
				<div :class="['tadmin-relative', 'tadmin-z-10', 'tadmin-rounded-[5px]', 'tadmin-text-center', 'tadmin-pt-[1em]', 'tadmin-border', 'tadmin-border-solid', 'tadmin-border-transparent', { 'hover:tadmin-border-[#bbb] tadmin-cursor-pointer': day.day }, { check: dayjs(check).isSame(dayjs(`${day.year}-${day.month}-${day.day}`), 'day') }]" v-for="(day, dayIndex) in item" :key="dayIndex + 7" @click="onChooseDate(day)">
					<div :class="['tadmin-text-16', 'tadmin-mb-[0.5em]', { holiday: isHoliday(day) }]">{{ day.day }}</div>
					<div class="tadmin-text-12 tadmin-text-999">{{ transLunar(day) }}</div>
				</div>
				<b class="tadmin-text-[25em] tadmin-absolute tadmin-left-2/4 tadmin-top-2/4 tadmin-translate-x-[-50%] tadmin-translate-y-[-50%] tadmin-opacity-10 tadmin-select-none">{{ index + 1 }}</b>
			</div>
		</el-col>
	</el-row>
</template>

<script lang="ts" setup>
import dayjs from 'dayjs'
//@ts-ignore
import LunarCalendar from 'lunar-calendar'

const props = defineProps({
	modelValue: {
		type: String,
		default: ''
	},
	year: {
		type: [String, Number],
		default: () => dayjs().year()
	},
	holidays: {
		type: Array,
		default: () => []
	}
})
const emit = defineEmits(['update:modelValue', 'change'])
//转换的节假日
const transHoliday: Set<string> = new Set([])
const weeks = ['一', '二', '三', '四', '五', '六', '日']
const fullDate = ref([])
const check = ref<string>('')

/**
 * +++++++++++++++++++++++++++++++++++++++++
 * 渲染日历
 * +++++++++++++++++++++++++++++++++++++++++
 * **/
function renderCalendar() {
	for (let i = 1; i <= 12; i++) {
		const calendarData = LunarCalendar.calendar(props.year, i)
		let transData = []
		for (let k = 1; k < calendarData.firstDay; k++) {
			transData.push({ day: '', lunarDayName: '', solarFestival: '', lunarFestival: '', term: '' })
		}
		transData = transData.concat(calendarData.monthData)
		fullDate.value.push(transData)
	}
}

/**
 * +++++++++++++++++++++++++++++++++++++++++
 * 转换农历字符串
 * +++++++++++++++++++++++++++++++++++++++++
 * **/
function transLunar(item: any) {
	if (item.solarFestival) {
		return item.solarFestival.match('节') ? item.solarFestival.split(' ')[0] : item.lunarDayName
	} else {
		return item['term'] || item['lunarDayName']
	}
}

/**
 * +++++++++++++++++++++++++++++++++++++++++
 * 是否是节假日
 * +++++++++++++++++++++++++++++++++++++++++
 * **/
function isHoliday(item: any) {
	return transHoliday.has(dayjs(`${item.year}-${item.month}-${item.day}`).format('YYYY-MM-DD'))
}

/**
 * +++++++++++++++++++++++++++++++++++++++++
 * 选择日期
 * +++++++++++++++++++++++++++++++++++++++++
 * **/
function onChooseDate(item: any) {
	check.value = dayjs(`${item.year}-${item.month}-${item.day}`).format('YYYY-MM-DD')
	emit('change', Object.assign({}, toRaw(item), { isHoliday: isHoliday(item) }))
}

watch(
	() => props.holidays,
	nv => {
		fullDate.value = []
		nv.forEach((item: string) => {
			transHoliday.add(dayjs(item).format('YYYY-MM-DD'))
		})
		renderCalendar()
	},
	{ immediate: true }
)

watch(
	() => props.modelValue,
	nv => {
		check.value = nv
	},
	{ immediate: true }
)

watch(
	() => check.value,
	nv => emit('update:modelValue', nv)
)
</script>

<style lang="scss" scoped>
.holiday {
	color: var(--el-color-danger);
	&::before {
		content: '休';
		position: absolute;
		left: 4%;
		top: 6%;
		font-size: 12px;
		transform: scale(0.8);
		line-height: 100%;
	}
	& + div {
		color: var(--el-color-danger);
	}
}
.check {
	background-color: var(--el-color-primary-light-8);
}
</style>
