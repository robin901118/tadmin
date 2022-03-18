<template>
	<div>
		<el-card shadow="never">
			<template #header>
				<h5 class="cardTitle">日志管理</h5>
			</template>
			<!--查询栏-->
			<el-form :model="searchForm" ref="formRef" label-width="100px">
				<el-row :gutter="20">
					<el-col :xl="5" :lg="7" :md="24">
						<el-form-item label="文件名称" prop="name">
							<el-input v-model="searchForm.name" placeholder="请输入文件名称" />
						</el-form-item>
					</el-col>
					<el-col :xl="5" :lg="7" :md="24">
						<el-form-item label="日志类型" prop="type">
							<t-dict v-model="searchForm.type" label="log_type" />
						</el-form-item>
					</el-col>
					<el-col :xl="5" :lg="7" :md="24">
						<el-form-item label="日志级别" prop="level">
							<t-dict v-model="searchForm.level" label="log_level" />
						</el-form-item>
					</el-col>
					<el-col :xl="5" :lg="7" :md="24">
						<el-form-item label="日志日期" prop="date">
							<el-date-picker v-model="searchForm.date" value-format="YYYY-MM-DD" type="date" placeholder="请选择日期" style="width: 100%" />
						</el-form-item>
					</el-col>
					<el-col :xl="4" :lg="6" :md="24">
						<el-button type="primary" icon="Search" @click="getTableData">查询</el-button>
						<el-button icon="RefreshLeft" @click="onReset">重置</el-button>
					</el-col>
				</el-row>
			</el-form>
			<el-divider></el-divider>
			<!--操作栏-->
			<span v-auth="'sys:log:download'">
				<el-button icon="Download" @click="downloadBatch" :loading="downloadLoading">下载</el-button>
			</span>

			<t-info-block class="tadmin-my-20">
				<span class="tadmin-text-14 tadmin-mr-[1em]">
					已选择
					<span class="tadmin-px-[0.5em]" style="color: var(--el-color-primary)">{{ selectedRows.length }}</span>
					项
				</span>
				<el-button type="text" @click="mainTable.$refs.table.clearSelection()" v-show="selectedRows.length">清空</el-button>
			</t-info-block>
			<!--数据表格-->
			<t-table ref="mainTable" :table-props="{ data: tableData, border: true, onSelectionChange: tableSelectionHandle, rowKey: 'path' }" :pagination-props="{ layout: 'total, sizes, prev, pager, next, jumper', total: tableTotal, hideOnSinglePage: true, onCurrentChange: currentChange, onSizeChange: sizeChangeHandle }" v-loading="requestLoading" :col="tableCols" />
		</el-card>
	</div>
</template>

<script lang="tsx" setup>
import { ElForm, ElMessage } from 'element-plus'
import { getAllLogs } from '@/api/system/log'
import addUserDialog from './addUserDialog.vue'
import { useTableMixins } from '@/mixins/tableMixins'
import download from '@/utils/download'

const { searchForm, requestLoading, tableData, tableTotal, getTableData, currentChange, sizeChangeHandle, selectedRows, tableSelectionHandle, onReset } = useTableMixins({
	requestParams: {
		name: '',
		type: '',
		level: '',
		date: ''
	},
	requestFun: getAllLogs
})
//单个下载loading
const downloadLoading = ref<boolean>(false)
//表单实例
const formRef = ref<InstanceType<typeof ElForm>>()
const tableCols = [
	{ type: 'selection', width: 40, align: 'center', show: true },
	{ label: '日志日期', prop: 'date', align: 'center', width: 150, show: true },
	{ label: '日志类型', prop: 'type', align: 'center', show: true },
	{ label: '文件名称', prop: 'fileName', align: 'center', show: true, width: 300 },
	{ label: '文件路径', prop: 'path', align: 'center', show: true, width: 300 },
	{
		label: '日志级别',
		prop: 'level',
		align: 'center',
		show: true,
		__slot: scope => scope.row.level && <el-tag type={scope.row.level === 'FULL' ? 'success' : 'danger'}>{scope.row.level === 'FULL' ? '全部' : '错误'}</el-tag>
	},
	{
		label: '操作',
		align: 'center',
		show: true,
		width: 140,
		fixed: 'right',
		__slot: scope => (
			<span v-auth={'sys:log:real'}>
				<el-button type='primary' size='small' icon='DataAnalysis' onClick={() => onLookRealTimeLog(scope.row.path)}>
					实时日志
				</el-button>
			</span>
		)
	}
]
//表格实例
const mainTable = ref(null)
//添加、编辑弹窗显示隐藏
const addDialogVisible = ref<boolean>(false)

/**
 * ++++++++++++++++++++++++++++++++++++++++
 * 查看实时日志
 * ++++++++++++++++++++++++++++++++++++++++
 * **/
function onLookRealTimeLog(path: string) {
	window.open('/realTimeLog?path=' + path, '', 'width=980,height=800')
}

/**
 * ++++++++++++++++++++++++++++++++++++++++
 * 重置查询条件
 * ++++++++++++++++++++++++++++++++++++++++
 * **/
function onResetSearch() {
	formRef.value.resetFields()
	getTableData()
}

/**
 * ++++++++++++++++++++++++++++++++++++++++
 * 批量文件
 * ++++++++++++++++++++++++++++++++++++++++
 * **/
function downloadBatch() {
	if (!selectedRows.value.length) {
		return ElMessage.warning('请先选择一条日志！')
	} else if (selectedRows.value.length > 5) {
		return ElMessage.warning('单次最多只能下载5条！')
	}
	downloadLoading.value = true
	download('/sys/log/downLoad', 'get', { ids: selectedRows.value.map(item => item.path).join(',') }).finally(() => {
		downloadLoading.value = false
	})
}

getTableData()
</script>
