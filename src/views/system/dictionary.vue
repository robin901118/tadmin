<template>
	<div>
		<el-card shadow="never">
			<template #header>
				<h5 class="cardTitle">数据字典</h5>
			</template>
			<el-form :model="searchForm" label-width="80px" ref="formRef">
				<el-row :gutter="20">
					<el-col :xl="6" :lg="8" :md="24">
						<el-form-item label="字典名称" prop="dictName">
							<el-input v-model="searchForm.dictName" placeholder="请输入字典名称" />
						</el-form-item>
					</el-col>
					<el-col :xl="6" :lg="8" :md="24">
						<el-form-item label="字典编号" prop="dictNo">
							<el-input v-model="searchForm.dictNo" placeholder="请输入字典编号" />
						</el-form-item>
					</el-col>
					<el-col :xl="6" :lg="8" :md="24" class="tadmin-text-right lg:tadmin-text-left">
						<el-button type="primary" icon="Search" @click="getTableData">查询</el-button>
						<el-button icon="RefreshLeft" @click="onResetSearch">重置</el-button>
					</el-col>
				</el-row>
			</el-form>
			<el-divider></el-divider>
			<span v-auth="'sys:dict:add'">
				<el-button type="primary" icon="Plus" class="tadmin-align-top tadmin-mr-[0.5em]" @click="onAdd">添加字典</el-button>
			</span>
			<el-button icon="Refresh" @click="onFreshCatch" :loading="catchBtnLoading">刷新缓存</el-button>
			<el-table ref="mainTable" :data="tableData" v-loading="requestLoading" row-key="dictId" class="tadmin-mt-20 tadmin-w-full" border>
				<el-table-column label="序号" type="index" width="60" align="center" />
				<el-table-column label="字典名称" prop="dictName" width="160" />
				<el-table-column label="字典编号" prop="dictNo" width="140" />
				<el-table-column label="描述" prop="dictDesc" />
				<el-table-column label="操作" align="center" fixed="right" width="200">
					<template #default="scope">
						<span v-auth="'sys:dict:edit'">
							<el-button type="text" @click="onUpdate(scope.row)">编辑</el-button>
						</span>
						<el-divider direction="vertical"></el-divider>
						<span v-auth="'sys:dict:auth'">
							<el-button type="text" @click="onOpenDrawer(scope.row)">字典配置</el-button>
						</span>
						<el-divider direction="vertical"></el-divider>
						<span v-auth="'sys:dict:delete'">
							<el-popconfirm title="确定删除这条字典吗?" @confirm="onDelDict(scope.row.dictId)">
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

			<!--添加、修改字典弹窗-->
			<add-dict-dialog v-model="addDialogVisible" ref="addDict" :is-add="isAdd" @success="getTableData()" />

			<!--字典配置抽屉-->
			<dict-config-drawer v-model="dictConfigVisible" :dict-id="dictDrawerId" />
		</el-card>
	</div>
</template>

<script lang="ts" setup>
import { getDictionary, delDictByIds } from '@/api/system/dict'
import type { Dictionary } from '@/api/system/dict'
import addDictDialog from './addDictDialog.vue'
import dictConfigDrawer from './dictConfigDrawer.vue'
import { useTableMixins } from '@/mixins/tableMixins'
import { ElForm, ElMessage } from 'element-plus'
import { cloneDeep } from 'lodash'

const { searchForm, tableData, requestLoading, tableTotal, getTableData, currentChange, sizeChangeHandle } = useTableMixins({
	requestParams: {
		dictName: '',
		dictNo: ''
	},
	requestFun: getDictionary
})
//表单实例
const formRef = ref<InstanceType<typeof ElForm>>()
//初始加载数据
getTableData()
//添加、编辑弹窗显示隐藏
const addDialogVisible = ref<boolean>(false)
const addDict = ref()
const isAdd = ref<boolean>(true)
//字典配置列表抽屉
const dictConfigVisible = ref<boolean>(false)
const dictDrawerId = ref<number | string>(0)
// 刷新缓存字典
const setDictCatch: any = inject('setDictCatch')
const catchBtnLoading = ref<boolean>(false)

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
 * 新增
 * ++++++++++++++++++++++++++++++++++++++++
 * **/
function onAdd() {
	isAdd.value = true
	addDialogVisible.value = true
}

/**
 * ++++++++++++++++++++++++++++++++++++++++
 * 编辑
 * ++++++++++++++++++++++++++++++++++++++++
 * **/
function onUpdate(item: Dictionary) {
	isAdd.value = false
	addDialogVisible.value = true
	const cloneItem = cloneDeep(item)
	nextTick(() => {
		for (let key in addDict.value.form) {
			cloneItem?.[key] && (addDict.value.form[key] = cloneItem[key])
		}
	})
}

/**
 * ++++++++++++++++++++++++++++++++++++++++
 * 删除
 * ++++++++++++++++++++++++++++++++++++++++
 * **/
function onDelDict(id) {
	delDictByIds({ ids: '' + id }).then(() => {
		ElMessage({
			type: 'success',
			message: '删除成功'
		})
		getTableData()
	})
}

/**
 * ++++++++++++++++++++++++++++++++++++++++
 * 打开字典配置
 * ++++++++++++++++++++++++++++++++++++++++
 * **/
function onOpenDrawer(item: Dictionary) {
	dictDrawerId.value = item.dictId
	nextTick(() => {
		dictConfigVisible.value = true
	})
}

/**
 * ++++++++++++++++++++++++++++++++++++++++
 * 刷新缓存
 * ++++++++++++++++++++++++++++++++++++++++
 * **/
function onFreshCatch() {
	catchBtnLoading.value = true
	setDictCatch(true).finally(() => {
		catchBtnLoading.value = false
	})
}
</script>
