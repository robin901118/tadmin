<template>
	<div>
		<el-card shadow="never">
			<template #header>
				<h5 class="cardTitle">参数管理</h5>
			</template>
			<!--查询栏-->
			<el-form ref="formRef" label-width="100px" :model="searchForm">
				<el-row :gutter="20">
					<el-col :xl="6" :lg="8" :md="24">
						<el-form-item label="参数名称" prop="paramKey">
							<el-input placeholder="请输入参数名称" v-model="searchForm.paramKey" />
						</el-form-item>
					</el-col>
					<el-col :xl="6" :lg="8" :md="24">
						<el-form-item label="参数键名" prop="paramName">
							<el-input placeholder="请输入参数键名" v-model="searchForm.paramName" />
						</el-form-item>
					</el-col>
					<el-col :xl="6" :lg="8" :md="24" class="tadmin-text-right lg:tadmin-text-left">
						<el-button type="primary" icon="Search" @click="getTableData">查询</el-button>
						<el-button icon="RefreshLeft" @click="onReset">重置</el-button>
					</el-col>
				</el-row>
			</el-form>
			<el-divider />
			<span v-auth="'sys:param:add'">
				<el-button type="primary" icon="Plus" class="tadmin-align-top tadmin-mr-[0.5em]" @click="onAddHandle">添加</el-button>
			</span>
			<span v-auth="'sys:param:delete'">
				<el-button type="danger" icon="Delete" class="tadmin-align-top tadmin-mr-[0.5em]" v-show="selectedRows.length" @click="batchDel">删除</el-button>
			</span>

			<t-info-block class="tadmin-my-20">
				<span class="tadmin-text-14 tadmin-mr-[1em]">
					已选择
					<span class="tadmin-px-[0.5em]" style="color: var(--el-color-primary)">{{ selectedRows.length }}</span>
					项
				</span>
				<el-button type="text" @click="mainTable.clearSelection()" v-show="selectedRows.length">清空</el-button>
			</t-info-block>
			<!--数据表格-->
			<el-table ref="mainTable" :data="tableData" v-loading="requestLoading" border row-key="paramId" class="tadmin-mt-20" @selection-change="tableSelectionHandle">
				<el-table-column type="selection" align="center" />
				<el-table-column label="序号" type="index" width="80px" align="center" />
				<el-table-column label="参数名称" prop="paramKey" width="300px" />
				<el-table-column label="参数键名" prop="paramName" width="200px" />
				<el-table-column label="参数键值" prop="paramValue" />
				<el-table-column label="备注" prop="remark" />
				<el-table-column label="操作" align="center" width="200" fixed="right">
					<template #default="scope">
						<span v-auth="'sys:param:edit'">
							<el-button type="text" @click="onUpdate(scope.row)">编辑</el-button>
						</span>
						<el-divider direction="vertical" />
						<span v-auth="'sys:param:delete'">
							<el-popconfirm title="是否删掉这一参数?" @confirm="singleDel(scope.row.paramId)">
								<template #reference>
									<el-button type="text">删除</el-button>
								</template>
							</el-popconfirm>
						</span>
					</template>
				</el-table-column>
			</el-table>
			<!--分页-->
			<div class="tadmin-pt-20 tadmin-flex tadmin-justify-end">
				<el-pagination layout="total, sizes, prev, pager, next, jumper" :total="tableTotal" @current-change="currentChange" hide-on-single-page @size-change="sizeChangeHandle" />
			</div>
		</el-card>
		<!--新增修改弹窗-->
		<add-param-dialog :is-add="isAdd" v-model="dialogVisible" @success="getTableData" ref="paraRef" />
	</div>
</template>

<script lang="ts" setup>
import { useTableMixins } from '@/mixins/tableMixins'
import { ElTable, ElMessageBox, ElMessage } from 'element-plus'
import addParamDialog from './addParamDialog.vue'
import { getAllParam, delParam } from '@/api/system/param'
import type { ParamItem } from '@/api/system/param'

const { searchForm, requestLoading, tableData, tableTotal, getTableData, currentChange, sizeChangeHandle, selectedRows, tableSelectionHandle, onReset } = useTableMixins({
	requestParams: {
		paramKey: '',
		paramName: ''
	},
	requestFun: getAllParam
})
//表格实例
const mainTable = ref<InstanceType<typeof ElTable>>()
//新增修改弹窗显示隐藏
const dialogVisible = ref<boolean>(false)
//是否是新增
const isAdd = ref<boolean>(true)
//弹窗实例
const paramRef = ref()

/**
 * ++++++++++++++++++++++++++++++++++++++++
 * 新增
 * ++++++++++++++++++++++++++++++++++++++++
 * **/
function onAddHandle() {
	isAdd.value = true
	dialogVisible.value = true
}

/**
 * ++++++++++++++++++++++++++++++++++++++++
 * 修改
 * ++++++++++++++++++++++++++++++++++++++++
 * **/
function onUpdate(record: ParamItem) {
	isAdd.value = false
	dialogVisible.value = true
	nextTick(() => {
		for (let key in paramRef.value.form) {
			record.hasOwnProperty(key) && (paramRef.value.form[key] = record[key])
		}
	})
}

/**
 * ++++++++++++++++++++++++++++++++++++++++
 * 批量删除
 * ++++++++++++++++++++++++++++++++++++++++
 * **/
function batchDel() {
	ElMessageBox({
		title: '删除',
		message: `您确定要删除 ${selectedRows.value.length} 条数据吗?`,
		showCancelButton: true,
		confirmButtonText: '确定',
		cancelButtonText: '关闭',
		beforeClose: (action, instance, done) => {
			delParam({ ids: selectedRows.value.map(item => item.paramId).join(',') }).then(() => {
				ElMessage.success('删除成功')
				getTableData()
				done()
			})
		}
	})
}

/**
 * ++++++++++++++++++++++++++++++++++++++++
 * 单个删除
 * ++++++++++++++++++++++++++++++++++++++++
 * **/
function singleDel(id: number) {
	delParam({ ids: id.toString() }).then(() => {
		ElMessage.success('删除成功')
		getTableData()
	})
}

getTableData()
</script>
