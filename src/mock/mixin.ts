import { cloneDeep } from 'lodash'
type ResponseType = (data?: object) => {
	readonly code: number
	readonly message: string
	readonly data: any
}
export const responseResult: ResponseType = function (data) {
	const template = {
		code: 200,
		message: '',
		data: {}
	}
	return Object.assign(cloneDeep(template), data)
}
