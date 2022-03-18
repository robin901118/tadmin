<template>
	<template v-if="props.type === 'select'">
		<el-select v-model="myValue" :placeholder="props.placeholder" :size="props.size" :disabled="props.disabled" :multiple="props.multiple" :clearable="props.clearable" :multiple-limit="props.multipleLimit" class="tadmin-w-full">
			<el-option v-for="(item, index) in options" :key="index" :label="item.groupText" :value="item.groupValue" />
		</el-select>
	</template>
	<template v-else-if="props.type === 'radio'">
		<el-radio-group v-model="myValue" :size="props.size" :disabled="props.disabled">
			<el-radio v-for="(item, index) in options" :key="index" :label="item.groupValue">{{ item.groupText }}</el-radio>
		</el-radio-group>
	</template>
	<template v-else-if="props.type === 'checkbox'">
		<el-checkbox-group v-model="myValue" :size="props.size" :disabled="props.disabled" :max="props.multipleLimit || undefined">
			<el-checkbox v-for="(item, index) in options" :key="index" :label="item.groupValue">{{ item.groupText }}</el-checkbox>
		</el-checkbox-group>
	</template>
	<template v-else-if="props.type === 'button'">
		<el-radio-group v-model="myValue" :size="props.size" :disabled="props.disabled">
			<el-radio-button v-for="(item, index) in options" :key="index" :label="item.groupValue">{{ item.groupText }}</el-radio-button>
		</el-radio-group>
	</template>
</template>

<script lang="ts" name="TDict" setup>
import { catch_dict_key } from '@/config'

interface DictProps {
	modelValue: any
	type?: 'select' | 'radio' | 'checkbox' | 'button'
	multiple?: boolean
	label: string
	multipleLimit?: number
	disabled?: boolean
	size?: 'large' | 'default' | 'small'
	placeholder?: string
	clearable?: boolean
}
const props = withDefaults(defineProps<DictProps>(), {
	//绑定值
	modelValue: '',
	//类型 select->下拉框 radio->单选框 checkbox->多选框
	type: 'select',
	//是否可以多选（type为radio时无效）
	multiple: false,
	//渲染的字典label，必填
	label: '',
	//最多选择几个，多选有效，0表示不限制（type为radio时无效）
	multipleLimit: 0,
	//是否禁用
	disabled: false,
	//大小，可选值：large/default/small
	size: 'default',
	//提示语
	placeholder: '请选择',
	//是否可清除，仅为select才有效
	clearable: true
})

const emit = defineEmits(['update:modelValue'])
const myValue = ref<any>([])
const options = ref<any>([])
;(function onRenderOptions() {
	let catchDict: any = localStorage.getItem(catch_dict_key)
	if (!catchDict) return false
	try {
		catchDict = JSON.parse(catchDict)
		const allDict = catchDict.dictGroupList
		options.value = (allDict?.[props.label] || []).map(item => {
			if (!isNaN(+item?.groupValue)) {
				item.groupValue = +item.groupValue
			}
			return item
		})
	} catch (e) {
		console.error(e)
		return false
	}
})()

watch(
	() => myValue.value,
	nv => {
		emit('update:modelValue', nv)
	}
)
watch(
	() => props.modelValue,
	nv => {
		myValue.value = nv
	},
	{ immediate: true }
)
</script>
