import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
// @ts-ignore
import packageJson from './package.json'
// @ts-ignore
import tailwindcss from 'tailwindcss'
// @ts-ignore
import autoprefixer from 'autoprefixer'
// @ts-ignore
import postcssImport from 'postcss-import'
import { viteMockServe } from 'vite-plugin-mock'
import VueSetupExtend from 'vite-plugin-vue-setup-extend'
import AutoImport from 'unplugin-auto-import/vite'
import vueJsx from '@vitejs/plugin-vue-jsx'

const pathResolve = (dir: string): any => {
	return resolve(__dirname, '.', dir)
}

const alias: Record<string, string> = {
	'@': pathResolve('./src/')
}

export default ({ mode }: any) => {
	const VITE_PACKAGE_NAME: string = loadEnv(mode, process.cwd()).VITE_PACKAGE_NAME
	const versionDir: string = `${VITE_PACKAGE_NAME}_V${packageJson.version}`
	//mock环境加入mock
	const localEnabled = loadEnv(mode, process.cwd()).VITE_APP_FLAG === 'mock' || loadEnv(mode, process.cwd()).VITE_APP_FLAG === 'testmock' || false
	const prodEnabled = loadEnv(mode, process.cwd()).VITE_APP_FLAG === 'testmock' || false
	const vitePlugins = [
		vue(),
		vueJsx(),
		VueSetupExtend(),
		AutoImport({
			imports: ['vue', 'vue-router', 'pinia']
		}),
		viteMockServe({
			mockPath: './src/mock',
			localEnabled, // 开发打包开关
			prodEnabled, // 生产打包开关
			injectCode: `
                import { setupProdMockServer } from './mock/mockProdServer';
                setupProdMockServer();
            `
		})
	]
	const postcssPlugin = [
		postcssImport,
		tailwindcss,
		autoprefixer({
			overrideBrowserslist: ['last 2 versions'],
			grid: true
		}),
		//删除 @charset
		{
			postcssPlugin: 'internal:charset-removal',
			AtRule: {
				charset: (atRule: any) => {
					if (atRule.name === 'charset') {
						atRule.remove()
					}
				}
			}
		}
	]

	return defineConfig({
		base: './',
		plugins: vitePlugins,
		css: {
			postcss: {
				plugins: postcssPlugin
			}
		},
		optimizeDeps: {
			include: ['element-plus/lib/locale/lang/zh-cn', 'element-plus/lib/locale/lang/en', 'element-plus/lib/locale/lang/zh-tw']
		},
		server: {
			host: '0.0.0.0',
			open: true,
			port: 8080
		},
		resolve: { alias },
		build: {
			// 关闭打包计算
			brotliSize: false,
			minify: 'terser', //terser 构建后文件体积更小
			outDir: 'dist/' + versionDir,
			sourcemap: false,
			chunkSizeWarningLimit: 1500,
			terserOptions: {
				compress: {
					drop_console: false,
					drop_debugger: true
				}
			},
			// 打包配置
			rollupOptions: {
				output: {
					chunkFileNames: 'js/[name]-[hash].js',
					entryFileNames: 'js/[name]-[hash].js',
					assetFileNames: 'static/[name]-[hash].[ext]'
				}
			}
		}
	})
}
