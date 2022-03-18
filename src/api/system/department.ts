import request from '@/utils/request'

export interface DepartmentData {
	id: string | number
	departName: string
	departType: string
	tel: string
	fax: string
	address: string
	sort: number
	remark: string
	parentId: string | number
	children?: Array<DepartmentData>
}

// 获取部门树
export const getAllDepart: HTTPFunction<Array<DepartmentData>> = () => request({ url: '/api/sys/getAllDepart', method: 'post' })
// 删除部门
export const delDepart: HTTPFunction<any, string> = data => request({ url: '/api/sys/delDepart', method: 'post', data })
