import request from '@/utils/request'
/**
 * +++++++++++++++++++++++++++++++++++
 * 类型
 * +++++++++++++++++++++++++++++++++++
 * **/
//日志
export type AllLog = Pick<LogBase, 'fileName' | 'level' | 'path' | 'type'>

/**
 * +++++++++++++++++++++++++++++++++++
 * 接口
 * +++++++++++++++++++++++++++++++++++
 * **/
// 获取所有日志列表
export const getAllLogs: HTTPFunction<AllLog> = data => request({ url: '/sys/log/list', method: 'post', data })
