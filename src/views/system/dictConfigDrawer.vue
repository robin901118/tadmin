<!--字典配置弹窗-->
<template>
	<el-drawer v-model="visible" title="字典配置" :close-on-click-modal="false" @close="tableData = []">
		<el-button type="primary" icon="Plus" @click="onAdd">新增配置</el-button>
		<el-table :data="tableData" class="tadmin-mt-20" v-loading="requestLoading">
			<el-table-column label="名称" prop="groupText" align="center" />
			<el-table-column label="数值" prop="groupValue" align="center" />
			<el-table-column label="排序" prop="sortOrder" align="center" />
			<el-table-column label="状态" prop="status" align="center">
				<template #default="scope">
					<el-tag :type="scope.row.status === 1 ? 'success' : 'danger'" v-dict="{ label: 'status', value: scope.row.status }" />
				</template>
			</el-table-column>
			<el-table-column label="操作" align="center">
				<template #default="scope">
					<el-button type="text" @click="onUpdate(scope.row)">编辑</el-button>
					<el-divider direction="vertical" />
					<el-popconfirm title="确定删除这条配置吗?" @confirm="onDel(scope.row.dictGroupId)">
						<template #reference>
							<el-button type="text">删除</el-button>
						</template>
					</el-popconfirm>
				</template>
			</el-table-column>
		</el-table>
		<div class="tadmin-text-right">
			<el-pagination layout="total, prev, pager, next" :total="tableTotal" @current-change="currentChange" hide-on-single-page @size-change="sizeChangeHandle" />
		</div>
	</el-drawer>

	<!--新增字典配置弹窗-->
	<add-dict-config v-model="addDictConfigDialogVisible" ref="confPop" :is-add="isAdd" @success="getTableData()" />
</template>

<script lang="ts" setup>
import type { DictConfigRecord } from '@/api/system/dict'
import { getDictGroup, delGroupDictByIds } from '@/api/system/dict'
import addDictConfig from './addDictConfig.vue'
import { useTableMixins } from '@/mixins/tableMixins'
import { ElMessage } from 'element-plus'

const props = defineProps({
	//显示隐藏
	modelValue: {
		type: Boolean,
		default: false
	},
	dictId: {
		type: [String, Number],
		default: 0
	}
})
const emit = defineEmits(['update:modelValue'])
const { searchForm, tableData, getTableData, requestLoading, tableTotal, currentChange, sizeChangeHandle } = useTableMixins({
	requestParams: {
		dictId: ''
	},
	requestFun: getDictGroup
})

//抽屉显示隐藏
const visible = ref<boolean>(false)
//新增、编辑字典值配置弹窗
const addDictConfigDialogVisible = ref<boolean>(false)
const confPop = ref()
const isAdd = ref<boolean>(true)

/**
 * ++++++++++++++++++++++++++++++++++++++++
 * 新增
 * ++++++++++++++++++++++++++++++++++++++++
 * **/
function onAdd() {
	isAdd.value = true
	confPop.value.form.dictId = props.dictId
	addDictConfigDialogVisible.value = true
}

/**
 * ++++++++++++++++++++++++++++++++++++++++
 * 修改
 * ++++++++++++++++++++++++++++++++++++++++
 * **/
function onUpdate(item: DictConfigRecord) {
	isAdd.value = false
	addDictConfigDialogVisible.value = true
	nextTick(() => {
		for (let key in confPop.value.form) {
			item[key] && (confPop.value.form[key] = item[key])
		}
	})
}

/**
 * ++++++++++++++++++++++++++++++++++++++++
 * 修改
 * ++++++++++++++++++++++++++++++++++++++++
 * **/
function onDel(ids: string | number) {
	delGroupDictByIds({ ids: '' + ids }).then(() => {
		ElMessage({
			type: 'success',
			message: '删除成功'
		})
		getTableData()
	})
}

watch(
	() => visible.value,
	nv => emit('update:modelValue', nv)
)
watch(
	() => props.modelValue,
	nv => {
		visible.value = nv
		if (nv) {
			searchForm.dictId = props.dictId
			nextTick(() => getTableData())
		}
	},
	{ immediate: true }
)
</script>
