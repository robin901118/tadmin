/*
 * ++++++++++++++++++++++++++++++++++++++++
 * 通用的表格混合，适用于简易的表格，如果需求
 * 比较复杂的表格，请自行编写表格逻辑
 * ++++++++++++++++++++++++++++++++++++++++
 * */
import { isFunction, cloneDeep } from 'lodash'
import { ElMessage } from 'element-plus'

type RequestParams = { [property: string]: any }
type RequestFun<T = any> = HTTPFunction<T>
type InitMixin = {
	requestParams?: RequestParams
	requestFun: RequestFun
}

export function useTableMixins(init: InitMixin) {
	//原始requestParams
	const oldRequestParams = cloneDeep(init.requestParams)
	//请求附带数据
	const searchForm = reactive(init.requestParams || {})
	//表格数据
	const tableData = ref<unknown[]>([])
	//加载loading
	const requestLoading = ref<boolean>(false)
	//总条数
	const tableTotal = ref<number>(0)
	//每页请求数量
	const size = ref<number>(10)
	//当前页数
	const currentPage = ref<number>(1)
	//已选中的集合
	const selectedRows = ref([])
	/**
	 * ++++++++++++++++++++++++++++++++++++++++++++++++++++++
	 *  获取表格数据
	 * ++++++++++++++++++++++++++++++++++++++++++++++++++++++
	 * **/
	function getTableData() {
		if (!isFunction(init?.requestFun))
			return ElMessage({
				type: 'error',
				message: 'requestFun参数错误'
			})
		requestLoading.value = true
		const params = toRaw(searchForm)
		init
			.requestFun({
				size: size.value,
				page: currentPage.value,
				...params
			})
			.then(res => {
				tableData.value = res?.list || []
				tableTotal.value = res?.total || 0
			})
			.finally(() => {
				requestLoading.value = false
			})
	}

	/**
	 * ++++++++++++++++++++++++++++++++++++++++++++++++++++++
	 *  页码切换
	 * ++++++++++++++++++++++++++++++++++++++++++++++++++++++
	 * **/
	function currentChange(page: number) {
		if (!page) return ElMessage.error('请传入page')
		currentPage.value = page
		getTableData()
	}

	/**
	 * ++++++++++++++++++++++++++++++++++++++++++++++++++++++
	 *  每页显示数量切换
	 * ++++++++++++++++++++++++++++++++++++++++++++++++++++++
	 * **/
	function sizeChangeHandle(val: number) {
		size.value = val
		getTableData()
	}

	/**
	 * ++++++++++++++++++++++++++++++++++++++++++++++++++++++
	 *  重置请求数据
	 * ++++++++++++++++++++++++++++++++++++++++++++++++++++++
	 * **/
	function onReset() {
		Object.assign(searchForm, cloneDeep(oldRequestParams))
		nextTick(() => getTableData())
	}

	/**
	 * ++++++++++++++++++++++++++++++++++++++++
	 * 表格选择
	 * ++++++++++++++++++++++++++++++++++++++++
	 * **/
	function tableSelectionHandle(row: Array<any>) {
		selectedRows.value = row
	}

	return {
		searchForm,
		tableData,
		requestLoading,
		tableTotal,
		getTableData,
		currentChange,
		sizeChangeHandle,
		onReset,
		selectedRows,
		tableSelectionHandle
	}
}
