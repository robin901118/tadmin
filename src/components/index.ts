import type { App } from 'vue'
import VChart from 'vue-echarts'
import Menus from 'vue3-menus'
import { use } from 'echarts/core'
import { PieChart, LineChart } from 'echarts/charts'
import { CanvasRenderer } from 'echarts/renderers'
import VueVirtualScroller from 'vue-virtual-scroller'
import { TooltipComponent, LegendComponent, GridComponent } from 'echarts/components'
import * as ElIconModules from '@element-plus/icons-vue'
import TInfoBlock from './TInfoBlock.vue'
import TDict from './TDict.vue'
import TTable from './TTable.vue'
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css'

export default (app: App) => {
	//安装全局插件
	app.use(VueVirtualScroller)
	app.component('v-chart', VChart)
	app.component('t-info-block', TInfoBlock)
	app.component('t-dict', TDict)
	app.component('t-table', TTable)
	app.use(Menus)
	use([PieChart, LineChart, CanvasRenderer, LegendComponent, GridComponent, TooltipComponent])
	// 注册图标
	for (let iconName in ElIconModules) {
		app.component(ElIconModules[iconName].name, ElIconModules[iconName])
	}
}
