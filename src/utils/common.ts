type GetQueryString<T> = (parameterName: T, currentUrl: T) => T

/**
 * +++++++++++++++++++++++++++++++++++++++++++++++++++++
 * 图片转换blob
 * @params base64  图片的base64
 *+++++++++++++++++++++++++++++++++++++++++++++++++++++
 * **/
export const convertBase64UrlToBlob = (base64: string): Blob => {
	const parts: string[] = base64.split(';base64,')
	const contentType: string = parts[0].split(':')[1]
	const raw = window.atob(parts[1])
	const rawLength: number = raw.length
	const uInt8Array: Uint8Array = new Uint8Array(rawLength)
	for (let i = 0; i < rawLength; i++) {
		uInt8Array[i] = raw.charCodeAt(i)
	}
	return new window.Blob([uInt8Array], { type: contentType })
}

/**
 * 解析URL中的参数
 * @param parameterName 参数名称
 * @param currentUrl 当前url
 * @returns {*}
 */
export const getQueryString: GetQueryString<string> = (parameterName, currentUrl) => {
	const rs: string[] = new RegExp('(^|[&,?])' + parameterName + '=([^&]*)(&|$)', 'gi').exec(currentUrl)
	if (rs) return rs[2]
	return null
}

/**
 * +++++++++++++++++++++++++++++++++++++++++++++++++++++
 * 动态图片引入
 *+++++++++++++++++++++++++++++++++++++++++++++++++++++
 * **/
export const getSrc = (name: string): string => {
	const path = `/src/assets/img/${name}`
	const modules = import.meta.globEager('/src/assets/img/*')
	return modules[path].default
}

/**
 * +++++++++++++++++++++++++++++++++++++++++++++++++++++
 * 判断当前系统是否处于深色模式
 *+++++++++++++++++++++++++++++++++++++++++++++++++++++
 * **/
export const isDark = (): boolean => {
	const isMediaDark = window?.matchMedia('(prefers-color-scheme: dark)').matches
	const isClassDark = document.documentElement.classList.contains('tadmin-dark')
	return isClassDark || isMediaDark
}

/**
 * ++++++++++++++++++++++++++++++
 * 颜色明度转换
 * ++++++++++++++++++++++++++++++
 * **/
export const hex2Rgb = (hex: any): any => {
	//十六进制转为RGB
	const rgb: Array<string> = [] // 定义rgb数组
	if (/^\#[0-9A-F]{3}$/i.test(hex)) {
		//判断传入是否为#三位十六进制数
		let sixHex = '#'
		hex.replace(/[0-9A-F]/gi, function (kw: any) {
			sixHex += kw + kw //把三位16进制数转化为六位
		})
		hex = sixHex //保存回hex
	}
	if (/^#[0-9A-F]{6}$/i.test(hex)) {
		//判断传入是否为#六位十六进制数
		hex.replace(/[0-9A-F]{2}/gi, function (kw: any) {
			rgb.push(eval('0x' + kw)) //十六进制转化为十进制并存如数组
		})
		return rgb //输出RGB格式颜色
	} else {
		console.log(`Input ${hex} is wrong!`)
		return ''
	}
}

/**
 * ++++++++++++++++++++++++++++++
 * 在数组中间插入元素
 * @param arr 原始数组
 * @param index 插入位置
 * @param newItem 插入的元素
 * ++++++++++++++++++++++++++++++
 * **/
export const insertArray = (arr: Array<any>, index: number, newItem: any): Array<any> => [...arr.slice(0, index), newItem, ...arr.slice(index)]

/**
 * ++++++++++++++++++++++++++++++
 * 判断是否是手机号
 * ++++++++++++++++++++++++++++++
 * **/
export const isPhone = (phone: string) => /^(?:(?:\+|00)86)?1[3-9]\d{9}$/.test(phone)
