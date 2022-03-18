<template>
	<div>
		<el-row :gutter="10">
			<el-col :span="authColVisible ? 17 : 24">
				<el-card shadow="never">
					<template #header>
						<h5 class="cardTitle">分类菜单管理</h5>
					</template>
					<!--查询栏-->
					<el-form ref="formRef" label-width="100px" :model="searchForm">
						<el-row :gutter="20">
							<el-col :xl="6" :lg="8" :md="24">
								<el-form-item label="菜单名" prop="menuName">
									<el-input placeholder="请输入菜单名" v-model="searchForm.topmenuName" />
								</el-form-item>
							</el-col>
							<el-col :xl="6" :lg="8" :md="24">
								<el-form-item label="菜单编号" prop="menuCode">
									<el-input placeholder="请输入菜单编号" v-model="searchForm.topmenuCode" />
								</el-form-item>
							</el-col>
							<el-col :xl="6" :lg="8" :md="24" class="tadmin-text-right lg:tadmin-text-left">
								<el-button type="primary" icon="Search" @click="getTableData">查询</el-button>
								<el-button icon="RefreshLeft" @click="onReset">重置</el-button>
							</el-col>
						</el-row>
					</el-form>
					<el-divider />
					<div v-auth="'sys:topmenu:add'">
						<el-button type="primary" icon="plus" @click="onOpenDialog(true)">添加</el-button>
					</div>
					<t-info-block class="tadmin-mt-20">
						当前选择的是：
						<span style="color: var(--el-color-primary)">{{ choosedRow.menuName }}</span>
					</t-info-block>
					<!--数据表格-->
					<el-table ref="mainTable" :data="tableData" v-loading="requestLoading" border row-key="topmenuId" class="tadmin-mt-20">
						<el-table-column label="排序" prop="sort" align="center" width="80px" />
						<el-table-column label="菜单名" prop="topmenuName" align="center" />
						<el-table-column label="菜单图标" prop="topmenuIcon" align="center">
							<template #default="scope">
								<el-icon v-if="scope.row.topmenuIcon">
									<component :is="scope.row.topmenuIcon" />
								</el-icon>
								<span v-else>-</span>
							</template>
						</el-table-column>
						<el-table-column label="菜单编号" prop="topmenuCode" align="center" />
						<el-table-column label="操作" align="center">
							<template #default="scope">
								<span v-auth="'sys:topmenu:edit'">
									<el-button type="text" @click="onUpdate(scope.row)">编辑</el-button>
								</span>
								<el-divider direction="vertical" />
								<span v-auth="'sys:topmenu:auth'">
									<el-button type="text" @click="onAuth(scope.row)">授权</el-button>
								</span>
								<el-divider direction="vertical" />
								<span v-auth="'sys:topmenu:delete'">
									<el-popconfirm title="是否删除该菜单?" @confirm="onDelHandle(scope.row.topmenuId)">
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
			</el-col>
			<el-col :span="7" v-show="authColVisible">
				<el-card shadow="never">
					<template #header>
						<h5 class="cardTitle">关联菜单配置</h5>
					</template>
					<el-tree :data="treeData" show-checkbox node-key="menuId" :props="{ label: transLabel }" :check-strictly="nodeNotLink" ref="routerTree" default-expand-all />
					<div class="flexJustify tadmin-pt-20">
						<el-dropdown>
							<el-button>
								树操作
								<el-icon class="el-icon--right"><arrow-up /></el-icon>
							</el-button>
							<template #dropdown>
								<el-dropdown-menu>
									<el-dropdown-item @click="nodeNotLink = false">父子关联</el-dropdown-item>
									<el-dropdown-item @click="nodeNotLink = true">取消关联</el-dropdown-item>
									<el-dropdown-item @click="checkedAll(true)">全部选择</el-dropdown-item>
									<el-dropdown-item @click="checkedAll(false)">取消全选</el-dropdown-item>
									<el-dropdown-item @click="unFoldAll(treeData, 'menuId')">展开所有</el-dropdown-item>
									<el-dropdown-item @click="collapseAll(treeData, 'menuId')">折叠所有</el-dropdown-item>
								</el-dropdown-menu>
							</template>
						</el-dropdown>
						<div>
							<el-button @click="onCloseAuth">取消</el-button>
							<el-button type="primary" @click="onSaveAuth">保存</el-button>
						</div>
					</div>
				</el-card>
			</el-col>
		</el-row>
		<!--添加、编辑弹窗-->
		<add-top-menu v-model="addVisible" :is-add="isAdd" @success="topMenuChangeCallBack" ref="addDialog" />
	</div>
</template>

<script lang="ts" setup>
import { useTableMixins } from '@/mixins/tableMixins'
import { useTreeMixins } from '@/mixins/treeMixins'
import { getAllMenus } from '@/api/system/menu'
import type { TopmenuRecord } from '@/api/system/topmenu'
import { omitButtonRouter } from '@/utils/router'
import { getTopMenus, delTopMenu, authRouter } from '@/api/system/topmenu'
import { ElTree, ElMessage } from 'element-plus'
import addTopMenu from './addTopMenu.vue'
import { useUserStore } from '@/store/user'

const { searchForm, requestLoading, tableData, tableTotal, getTableData, currentChange, sizeChangeHandle, onReset } = useTableMixins({
	requestParams: {
		topmenuName: '',
		topmenuCode: ''
	},
	requestFun: getTopMenus
})
const treeData = ref<TopmenuRecord[]>([])
const routerTree = ref<InstanceType<typeof ElTree>>()
// 树形操作
const { nodeNotLink, unFoldAll, collapseAll, checkedAll } = useTreeMixins({
	el: routerTree,
	data: treeData,
	defaultLink: true
})
//授权弹窗显示、隐藏
const authColVisible = ref<boolean>(false)
//添加、修改弹窗显示隐藏
const addVisible = ref<boolean>(false)
//是否是添加
const isAdd = ref<boolean>(true)
//添加弹窗实例
const addDialog = ref()
//左侧选中的
const choosedRow = reactive<any>({
	menuName: '',
	topmenuId: 0
})
//用户状态仓库实例
const userStore = useUserStore()

/**
 * +++++++++++++++++++++++++++++++++++++++++
 * 转换树形结构的label
 * +++++++++++++++++++++++++++++++++++++++++
 * **/
function transLabel(data: any) {
	return data?.meta?.menuName || '未知'
}

/**
 * +++++++++++++++++++++++++++++++++++++++++
 * 打开弹窗
 * @param is_add 是否添加
 * +++++++++++++++++++++++++++++++++++++++++
 * **/
function onOpenDialog(is_add: boolean) {
	isAdd.value = is_add
	addVisible.value = true
}

/**
 * +++++++++++++++++++++++++++++++++++++++++
 * 编辑
 * @param item 数据
 * +++++++++++++++++++++++++++++++++++++++++
 * **/
function onUpdate(item: TopmenuRecord) {
	isAdd.value = false
	addVisible.value = true
	nextTick(() => {
		for (let record in addDialog.value.form) {
			item?.[record] && (addDialog.value.form[record] = item[record])
		}
	})
}

/**
 * +++++++++++++++++++++++++++++++++++++++++
 * 删除
 * @param id 数据id
 * +++++++++++++++++++++++++++++++++++++++++
 * **/
function onDelHandle(id) {
	onCloseAuth()
	delTopMenu({ ids: '' + id }).then(() => {
		ElMessage({
			type: 'success',
			message: '删除成功'
		})
		topMenuChangeCallBack()
	})
}

/**
 * +++++++++++++++++++++++++++++++++++++++++
 * 授权
 * @param item 数据
 * +++++++++++++++++++++++++++++++++++++++++
 * **/
function onAuth(item: TopmenuRecord) {
	authColVisible.value = true
	choosedRow.menuName = item.topmenuName
	choosedRow.topmenuId = item.topmenuId
	routerTree.value.setCheckedKeys(item.menuIds.split(',').map(item => +item))
}

/**
 * +++++++++++++++++++++++++++++++++++++++++
 * 取消授权
 * +++++++++++++++++++++++++++++++++++++++++
 * **/
function onCloseAuth() {
	authColVisible.value = false
	choosedRow.menuName = ''
	choosedRow.topmenuId = 0
}

/**
 * +++++++++++++++++++++++++++++++++++++++++
 * 保存授权菜单
 * +++++++++++++++++++++++++++++++++++++++++
 * **/
function onSaveAuth() {
	let idsIncludeParentId: any = []
	routerTree.value.getCheckedNodes().forEach(item => {
		idsIncludeParentId.push(item.menuId)
		idsIncludeParentId.push(item.parentId)
	})
	//去重，因为有很可能有很多个相同的parentId
	idsIncludeParentId = [...new Set(idsIncludeParentId)]
	authRouter({ topmenuId: choosedRow.topmenuId, menuIds: idsIncludeParentId.join(',') }).then(() => {
		ElMessage({
			type: 'success',
			message: '授权成功'
		})
		onCloseAuth()
		getTableData()
	})
}

/**
 * +++++++++++++++++++++++++++++++++++++++++
 * 顶部菜单添加、修改成功
 * +++++++++++++++++++++++++++++++++++++++++
 * **/
function topMenuChangeCallBack() {
	getTableData()
	userStore.GET_USER_INFO()
}

//获取所有路由
getAllMenus().then((res: any) => {
	treeData.value = omitButtonRouter(res)
})
getTableData()
//监听关闭授权栏
watch(
	() => authColVisible.value,
	nv => {
		if (!nv) {
			checkedAll(false)
			nodeNotLink.value = true
		}
	}
)
</script>
