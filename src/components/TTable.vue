<script lang="tsx">
export default defineComponent({
	name: 'tTable',
	props: {
		//列配置
		col: {
			type: Array,
			default: () => []
		},
		//表格，见element-plus API
		tableProps: {
			type: Object,
			default: () => ({})
		},
		//分页配置，见element-plus API
		//事件用 onSizeChange这种驼峰式
		paginationProps: {
			type: Object,
			default: () => ({})
		},
		//是否显示【隐藏列】按钮
		colHider: {
			type: Boolean,
			default: true
		}
	},
	setup(props: any) {
		/*表格列slot*/
		const scopedSlots = function (item: any) {
			return {
				default: (scoped: any) => {
					return item.__slot(scoped)
				}
			}
		}

		/*隐藏列*/
		const popoverSlots = {
			reference: () => <el-button>隐藏列</el-button>
		}
		const checkList = ref([])

		//初始化勾选show=true的列
		props.col.forEach((item: any) => {
			if (item.show) {
				checkList.value.push(item.label)
			}
		})

		return () => (
			<div>
				<el-table {...props.tableProps} ref='table' style='width:100%'>
					{props.col.map((item: any, index: number) => {
						if (checkList.value.includes(item.label)) {
							if (item.__slot) {
								return <el-table-column {...item} v-slots={scopedSlots(item)} key={index} />
							} else {
								return <el-table-column {...item} key={index} />
							}
						}
					})}
				</el-table>
				<div class='flexJustify tadmin-mt-10'>
					{props.colHider ? (
						<el-popover trigger='click' placement='top' v-slots={popoverSlots}>
							<el-checkbox-group v-model={checkList.value}>
								{props.col.map((item: any, index: number) => {
									return <el-checkbox label={item.label} key={index} />
								})}
							</el-checkbox-group>
						</el-popover>
					) : (
						<div></div>
					)}
					{props.paginationProps && (
						<div class='tadmin-pt-20 tadmin-flex tadmin-justify-end'>
							<el-pagination {...props.paginationProps} ref='pagination' />
						</div>
					)}
				</div>
			</div>
		)
	}
})
</script>
