<template>
	<div>
		<el-card shadow="never">
			<template #header>
				<h5 class="cardTitle">任务管理</h5>
			</template>
			<el-form>
				<el-row :gutter="20">
					<el-col :xl="6" :lg="8" :md="24">
						<el-form-item label="任务名称">
							<el-input placeholder="请输入任务名称" v-model="searchForm.name" />
						</el-form-item>
					</el-col>
					<el-col :xl="6" :lg="8" :md="24">
						<el-button type="primary" icon="Search" @click="getTableData">查询</el-button>
						<el-button icon="RefreshLeft" @click="onReset">重置</el-button>
					</el-col>
				</el-row>
			</el-form>
			<el-divider />
			<div v-auth="'sys:task:add'">
				<el-button type="primary" icon="Plus" class="tadmin-align-top tadmin-mr-[0.5em]" @click="onAddTask">新增任务</el-button>
			</div>

			<el-table ref="mainTable" :data="tableData" border row-key="name" class="tadmin-mt-20">
				<el-table-column label="任务名称" prop="name" fixed width="200px" />
				<el-table-column label="执行类" prop="clazz" width="300px" />
				<el-table-column label="cron表达式" prop="cron" width="200px" />
				<el-table-column label="开始时间" prop="startTime" width="200px" />
				<el-table-column label="结束时间" prop="endTime" width="200px" />
				<el-table-column label="下次执行时间" prop="nextFireTime" width="200px" />
				<el-table-column label="状态" prop="status" width="100px">
					<template #default="scope">
						<el-tag :type="scope.row.status === 'ERROR' ? 'danger' : scope.row.status === 'PAUSED' ? 'warning' : 'success'">{{ scope.row.status }}</el-tag>
					</template>
				</el-table-column>
				<el-table-column label="描述" prop="description" width="300px" />
				<el-table-column label="操作" align="center" fixed="right" width="300px">
					<template #default="scope">
						<span v-auth="'sys:task:edit'">
							<el-button type="text" @click="onEdit(scope.row)">编辑</el-button>
						</span>
						<el-divider direction="vertical" />
						<el-button type="text" v-if="scope.row.status === 'NORMAL'" @click="onPause(scope.row.name)">暂停</el-button>
						<el-button type="text" v-else @click="onResume(scope.row.name)">恢复</el-button>
						<el-divider direction="vertical" />
						<el-button type="text" @click="onTrigger(scope.row.name)">立即执行</el-button>
						<el-divider direction="vertical" />
						<span v-auth="'sys:task:delete'">
							<el-popconfirm title="确定删除这条任务?" @confirm="onDelete(scope.row)">
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

		<!--添加、编辑 弹窗-->
		<add-task-drawer v-model="drawerVisible" :is-add="isAdd" @success="getTableData" ref="taskDrawer" />
	</div>
</template>

<script lang="ts" setup>
import addTaskDrawer from '@/views/system/addTaskDrawer.vue'
import { getAllTask, delTask, resumeTask, pauseTask, triggerTask } from '@/api/system/task'
import { useTableMixins } from '@/mixins/tableMixins'
import type { TaskItem } from '@/api/system/task'
import { ElMessage } from 'element-plus'
import { cloneDeep } from 'lodash'

const cronPopover = ref<boolean>(false)
const drawerVisible = ref<boolean>(false)
const isAdd = ref<boolean>(true)
const { searchForm, requestLoading, tableData, tableTotal, getTableData, currentChange, sizeChangeHandle, selectedRows, tableSelectionHandle, onReset } = useTableMixins({
	requestParams: {
		name: ''
	},
	requestFun: getAllTask
})
const taskDrawer = ref()

/**
 * ++++++++++++++++++++++++++++++++++++++++
 * 新增任务
 * ++++++++++++++++++++++++++++++++++++++++
 * **/
function onAddTask() {
	isAdd.value = true
	drawerVisible.value = true
}

/**
 * ++++++++++++++++++++++++++++++++++++++++
 * 删除任务
 * ++++++++++++++++++++++++++++++++++++++++
 * **/
function onDelete(item: TaskItem) {
	delTask({ name: item.name }).then(() => {
		ElMessage.success('删除成功')
		getTableData()
	})
}

/**
 * ++++++++++++++++++++++++++++++++++++++++
 * 修改任务
 * ++++++++++++++++++++++++++++++++++++++++
 * **/
function onEdit(item: TaskItem) {
	isAdd.value = false
	drawerVisible.value = true
	nextTick(() => {
		const newItem: any = cloneDeep(item)
		if (newItem.hasOwnProperty('jobDataMap')) {
			newItem.jobDataMap = Object.entries(newItem.jobDataMap)
			if (!newItem.jobDataMap.length) {
				delete newItem.jobDataMap
			}
		}
		for (let key in taskDrawer.value.form) {
			taskDrawer.value.form.hasOwnProperty(key) && newItem?.[key] && (taskDrawer.value.form[key] = newItem[key])
		}
	})
}

/**
 * ++++++++++++++++++++++++++++++++++++++++
 * 恢复任务
 * ++++++++++++++++++++++++++++++++++++++++
 * **/
function onResume(name: string) {
	resumeTask({ name }).then(() => {
		ElMessage.success('恢复成功')
		getTableData()
	})
}

/**
 * ++++++++++++++++++++++++++++++++++++++++
 * 暂停任务
 * ++++++++++++++++++++++++++++++++++++++++
 * **/
function onPause(name: string) {
	pauseTask({ name }).then(() => {
		ElMessage.success('暂停成功')
		getTableData()
	})
}

/**
 * ++++++++++++++++++++++++++++++++++++++++
 * 立即执行
 * ++++++++++++++++++++++++++++++++++++++++
 * **/
function onTrigger(name: string) {
	triggerTask({ name }).then(() => {
		ElMessage.success('执行成功')
		// getTableData()
	})
}

getTableData()
</script>
