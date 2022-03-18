import request from '@/utils/request'

export interface TaskItem {
	//具体执行类
	clazz: string
	//任务表达式
	cron: string
	//描述
	description: string
	endTime: string
	jobDataMap: string
	//任务名称
	name: string
	nextFireTime: string
	startTime: string
	status: string
}

export interface AddTask extends Pick<TaskItem, 'clazz' | 'cron' | 'description' | 'name'> {
	jobDataMap: {
		[propertyName: string]: string
	}
}

/**
 * +++++++++++++++++++++++++++++++++++
 * 接口
 * +++++++++++++++++++++++++++++++++++
 * **/
// 获取所有任务
export const getAllTask: HTTPFunction<ListData<TaskItem[]>> = data => request({ url: '/sys/quartz/list', method: 'post', data })
//删除任务
export const delTask: HTTPFunction<boolean, { name: string }> = data => request({ url: '/sys/quartz/delete', method: 'post', data })
//新增任务
export const addTask: HTTPFunction<boolean, AddTask> = data => request({ url: '/sys/quartz/add', method: 'post', data })
//修改任务
export const updateTask: HTTPFunction<boolean, AddTask> = data => request({ url: '/sys/quartz/update', method: 'post', data })
//恢复任务
export const resumeTask: HTTPFunction<boolean, { name: string }> = data => request({ url: '/sys/quartz/resume', method: 'post', data })
//暂停任务
export const pauseTask: HTTPFunction<boolean, { name: string }> = data => request({ url: '/sys/quartz/pause', method: 'post', data })
//立即执行
export const triggerTask: HTTPFunction<boolean, { name: string }> = data => request({ url: '/sys/quartz/trigger', method: 'post', data })
