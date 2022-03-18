import { responseResult } from './mixin'
import { MockMethod, Recordable } from 'vite-plugin-mock'

const baseData = [
	{
		date: '2022-03-14',
		fileName: 'tadmin-dubbo-consumer_2022-03-14-info-0.log',
		level: 'FULL',
		path: 'D:\\logs\\tadmin-dubbo-consumer\\2022-03-14-info-0.log',
		type: 'WEB'
	},
	{
		date: '2022-03-14',
		fileName: 'tadmin-dubbo-consumer_2022-03-14-error-0.log',
		level: 'ERROR',
		path: 'D:\\logs\\tadmin-dubbo-consumer\\2022-03-14-error-0.log',
		type: 'WEB'
	},
	{
		date: '2022-03-14',
		fileName: 'tadmin-dubbo-provider_2022-03-14-info-0.log',
		level: 'FULL',
		path: 'D:\\logs\\tadmin-dubbo-provider\\2022-03-14-info-0.log',
		type: 'SVC'
	},
	{
		date: '2022-03-14',
		fileName: 'tadmin-dubbo-provider_2022-03-14-error-0.log',
		level: 'ERROR',
		path: 'D:\\logs\\tadmin-dubbo-provider\\2022-03-14-error-0.log',
		type: 'SVC'
	}
]

export default function logApis(): Array<MockMethod> {
	return [
		/**
		 * +++++++++++++++++++++++++++++++++++
		 * 获取日志列表
		 * +++++++++++++++++++++++++++++++++++
		 * **/
		{
			url: '/sys/log/list',
			method: 'post',
			response: () => {
				return responseResult({
					data: {
						total: baseData.length,
						list: baseData
					}
				})
			}
		}
	]
}
