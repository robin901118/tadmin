/// <reference types="vite/client" />

declare module '*.vue' {
	import { DefineComponent } from 'vue'
	// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
	const component: DefineComponent<{}, {}, any>
	export default component
}

interface ImportMetaEnv {
	readonly VITE_APP_FLAG: string
	readonly VITE_APP_BASE_API: string
	readonly VITE_PACKAGE_NAME: string
}

interface ImportMeta {
	readonly env: ImportMetaEnv
}

declare module '@/*'
declare module 'mockjs'
declare module 'nprogress'

// 拓展类型
declare type RulesType = { [property: string]: Array<any> }
declare type HTTPFunction<T, U = any> = (data?: U) => Promise<T>
declare type ListData<T> = { list: T; total: number }
declare type TableData = { size: number; page: number }
declare type Pick<T, K extends keyof T> = {
	[P in K]: T[P]
}
