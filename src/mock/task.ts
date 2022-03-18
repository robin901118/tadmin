import { responseResult } from './mixin'
import { MockMethod, Recordable } from 'vite-plugin-mock'

const baseData = [
	{
		clazz: 'com.tadmin.dubbo.provider.job.HelloJob',
		cron: '0/50 * * * * ? ',
		description: '',
		endTime: '2022-02-22 11:30:43',
		jobDataMap: '',
		name: 'Hellojob',
		nextFireTime: '2022-02-22 11:30:50',
		startTime: '2022-02-15 15:19:07',
		status: 'NORMAL'
	}
]

export default function taskApis(): Array<MockMethod> {
	return [
		/**
		 * +++++++++++++++++++++++++++++++++++
		 * 获取任务列表
		 * +++++++++++++++++++++++++++++++++++
		 * **/
		{
			url: '/sys/quartz/list',
			method: 'post',
			response: () => {
				return responseResult({
					data: {
						total: baseData.length,
						list: baseData
					}
				})
			}
		},

		/**
		 * +++++++++++++++++++++++++++++++++++
		 * 暂停任务
		 * +++++++++++++++++++++++++++++++++++
		 * **/
		{
			url: '/sys/quartz/pause',
			method: 'post',
			response: () => {
				return responseResult({
					data: true
				})
			}
		},

		/**
		 * +++++++++++++++++++++++++++++++++++
		 * 立即执行
		 * +++++++++++++++++++++++++++++++++++
		 * **/
		{
			url: '/sys/quartz/trigger',
			method: 'post',
			response: () => {
				return responseResult({
					data: true
				})
			}
		},

		/**
		 * +++++++++++++++++++++++++++++++++++
		 * 恢复任务
		 * +++++++++++++++++++++++++++++++++++
		 * **/
		{
			url: '/sys/quartz/resume',
			method: 'post',
			response: () => {
				return responseResult({
					data: true
				})
			}
		}
	]
}
