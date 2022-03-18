<template>
	<el-upload class="avatar-uploader" v-bind="transProps" ref="upload">
		<template v-if="slotDefault">
			<slot :src="imageUrl" />
		</template>
		<template v-else>
			<template v-if="imageUrl">
				<el-image :src="imageUrl" class="avatar" fit="cover" />
				<div class="mask" @click.stop="imageUrl = ''">
					<el-icon color="#fff" size="20px"><Delete /></el-icon>
				</div>
			</template>
			<el-icon v-else class="avatar-uploader-icon"><plus /></el-icon>
		</template>
	</el-upload>
</template>

<script lang="ts" setup name="TImgUpload">
import { ElMessage, ElUpload } from 'element-plus'
import { oss_sign } from '@/config'
import dayjs from 'dayjs'
import axios from 'axios'
import { nanoid } from 'nanoid'

interface Props {
	modelValue: string
	policyRequest: () => Promise<any>
	uploadProps?: any
	isMin?: boolean
	minThreshold?: number
}
const slotDefault = !!useSlots().default
const props = withDefaults(defineProps<Props>(), {
	//绑定值
	modelValue: '',
	//oss请求接口
	policyRequest: null,
	//是否需要上传前压缩图片
	isMin: false,
	//压缩阈值，isMin为true的时候才生效
	minThreshold: 0.5,
	//el-upload的props
	uploadProps: {}
})
const imageUrl = ref<string>('')
const emits = defineEmits(['update:modelValue', 'change'])
const upload = ref<InstanceType<typeof ElUpload>>(null)
const transProps = computed(() => {
	const propsPlus = {
		action: '',
		beforeUpload: uploadBefore
	}
	if (props.uploadProps) {
		return { ...propsPlus, ...props.uploadProps }
	} else {
		return propsPlus
	}
})

function get_suffix(filename: string): string {
	let pos = filename.lastIndexOf('.')
	let suffix = ''
	pos != -1 && (suffix = filename.substring(pos))
	return suffix
}

/**
 * ++++++++++++++++++++++++++++++++++++++++
 * 上传前校验
 * ++++++++++++++++++++++++++++++++++++++++
 * **/
function uploadBefore(file: File) {
	// 上传文件之前校验图片格式和大小
	const isJPG = file.type === 'image/png' || file.type === 'image/jpeg'
	if (!isJPG) {
		ElMessage.error('上传图片只能是 png、jpg 格式!')
		return false
	}

	//开始oss上传
	picUpload(file)
	//因为不需要该组件上传，所以我们需要阻止它上传
	return false
}

/**
 * ++++++++++++++++++++++++++++++++++++++++
 * oss上传
 * ++++++++++++++++++++++++++++++++++++++++
 * **/
async function picUpload(file: File) {
	//上传前压缩（isMin开启的情况下）
	if (props.isMin) {
		if (typeof props.minThreshold !== 'number' && props.minThreshold <= 1) {
			return ElMessage({ type: 'error', message: 'min-threshold格式为：0.1-1数字类型' })
		}
		const minBase64 = await compressImg(file, props.minThreshold)
		file = dataURLtoFile(minBase64, file.name)
	}

	const pro = new Promise((resolve, reject) => {
		if (props.policyRequest) {
			// 判断签名有没有过期
			let res: any = JSON.parse(localStorage.getItem(oss_sign))
			let timestamp = dayjs().valueOf() / 1000
			if (res && res.expire - 100 > timestamp) {
				resolve(res)
			} else {
				// 阿里云上传的地址
				props
					.policyRequest()
					.then(res => {
						localStorage.setItem(oss_sign, JSON.stringify(res))
						resolve(res)
					})
					.catch(() => reject(false))
			}
		} else {
			ElMessage.error('请传入policyRequest字段')
			reject(false)
		}
	})

	pro.then((success: any) => {
		const ossData = new FormData()
		//key就代表文件层级和阿里云上的文件名
		let filename = file.name
		let picName = nanoid() + get_suffix(filename)
		let keyValue = success.dir + picName
		ossData.append('name', filename)
		ossData.append('key', keyValue)
		ossData.append('policy', success.policy)
		ossData.append('OSSAccessKeyId', success.accessId)
		ossData.append('success_action_status', '200')
		ossData.append('Signature', success.signature)
		ossData.append('file', file, file.name)
		const VITE_APP_FLAG = import.meta.env.VITE_APP_FLAG
		if (VITE_APP_FLAG === 'testmock' || VITE_APP_FLAG === 'mock') {
			//模拟环境
			const reader = new FileReader()
			reader.readAsDataURL(file)
			reader.onload = function () {
				imageUrl.value = reader.result as string
			}
		} else {
			axios
				.post(success.host, ossData, {
					headers: {
						'Content-Type': 'multipart/form-data'
					}
				})
				.then(res => {
					if (res.status === 200) {
						// 这个URL就是上传后得到的绝对路径
						imageUrl.value = success.host + '/' + keyValue
						emits('change', imageUrl.value)
					}
				})
				.catch((error: any) => {
					console.error(error)
					ElMessage.error('上传失败!')
				})
		}
	})
}

/**
 * ++++++++++++++++++++++++++++++++++++++++
 * 压缩图片
 * ++++++++++++++++++++++++++++++++++++++++
 * **/
function compressImg(file: File, minThreshold: number): Promise<string> {
	console.log('开始压缩')
	if (!file || !window.FileReader) return // 判断是否支持FileReader
	let reader = new FileReader()
	reader.readAsDataURL(file) // 转成 base64 格式
	return new Promise((resolve, reject) => {
		// 读取成功后的回调
		reader.onloadend = function () {
			const img: any = new Image()
			const result = this.result as string
			img.src = result
			// 判断图片是否大于500K,是就直接上传，反之压缩图片
			if (result.length <= 500 * 1024) {
				resolve(result)
			} else {
				img.onload = function () {
					const canvas: HTMLCanvasElement = document.createElement('canvas')
					const ctx = canvas.getContext('2d')
					const tCanvas: HTMLCanvasElement = document.createElement('canvas')
					const tctx = tCanvas.getContext('2d')
					let width: number = img.width
					let height: number = img.height
					// 如果图片大于四百万像素，计算压缩比并将大小压至400万以下
					let ratio
					if ((ratio = (width * height) / 4000000) > 1) {
						ratio = Math.sqrt(ratio)
						width /= ratio
						height /= ratio
					} else {
						ratio = 1
					}
					canvas.width = width
					canvas.height = height
					ctx.fillStyle = '#fff' // 铺底色
					ctx.fillRect(0, 0, canvas.width, canvas.height)
					// 如果图片像素大于100万则使用瓦片绘制
					let count
					if ((count = (width * height) / 1000000) > 1) {
						count = ~~(Math.sqrt(count) + 1) // 计算要分成多少块瓦片
						// 计算每块瓦片的宽和高
						let nw = ~~(width / count)
						let nh = ~~(height / count)
						tCanvas.width = nw
						tCanvas.height = nh
						for (let i = 0; i < count; i++) {
							for (let j = 0; j < count; j++) {
								tctx.drawImage(img, i * nw * ratio, j * nh * ratio, nw * ratio, nh * ratio, 0, 0, nw, nh)
								ctx.drawImage(tCanvas, i * nw, j * nh, nw, nh)
							}
						}
					} else {
						ctx.drawImage(img, 0, 0, width, height)
					}
					// 进行压缩(---------minThreshold越低 图片越小,示例：0.5)
					let newBase64 = canvas.toDataURL('image/jpeg', minThreshold)
					tCanvas.width = tCanvas.height = canvas.width = canvas.height = 0
					resolve(newBase64) // 返回压缩后的base64
				}
			}
		}
	})
}

/**
 * ++++++++++++++++++++++++++++++++++++++++
 * 把base64转file对象
 * ++++++++++++++++++++++++++++++++++++++++
 * **/
function dataURLtoFile(dataUrl: string, filename: string): File {
	let arr = dataUrl.split(','),
		mime = arr[0].match(/:(.*?);/)[1],
		bstr = window.atob(arr[1]),
		n = bstr.length,
		u8arr = new Uint8Array(n)
	while (n--) {
		u8arr[n] = bstr.charCodeAt(n)
	}
	return new File([u8arr], filename, { type: mime })
}

watch(
	() => props.modelValue,
	(nv: string) => (imageUrl.value = nv),
	{ immediate: true }
)
watch(
	() => imageUrl.value,
	(nv: string) => {
		emits('update:modelValue', nv)
	}
)
defineExpose({ upload })
</script>

<style lang="scss" scoped>
::v-deep(.el-upload) {
	line-height: 0;
	display: block;
}
.avatar-uploader {
	border: 1px dashed #d9d9d9;
	border-radius: 6px;
	cursor: pointer;
	position: relative;
	overflow: hidden;
	display: block;
	&:hover {
		border-color: var(--el-color-primary);
	}
}
.el-icon.avatar-uploader-icon {
	font-size: 28px;
	color: #8c939d;
	width: 178px;
	height: 178px;
	text-align: center;
}
.avatar {
	width: 178px;
	height: 178px;
	display: block;
}
.mask {
	@apply tadmin-flex tadmin-absolute tadmin-inset-0 tadmin-items-center tadmin-justify-center tadmin-opacity-0;
	background-color: rgba(0, 0, 0, 0.3);
	&:hover {
		opacity: 1;
	}
}
</style>
