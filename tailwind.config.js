const PresetFontSizeConfig = {}
const PresetRadiusConfig = {}
const PresetSpacingConfig = {}

for (let i = 0; i < 100; i++) {
	if (i < 61) {
		PresetFontSizeConfig[i] = i + 'px'
	}
	if (i < 30) {
		PresetRadiusConfig[i] = i + 'px'
	}
	PresetSpacingConfig[i] = i + 'px'
}

function cloneDeep(obj) {
	return JSON.parse(JSON.stringify(obj))
}

module.exports = {
	darkMode: 'class',
	content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
	prefix: 'tadmin-',
	corePlugins: {
		preflight: false
	},
	theme: {
		//基于默认配置的继承样式
		extend: {
			colors: {
				green: '#348D67', //绿
				lightBlue: 'rgb(243,245,255)',
				darkBlue: '#0F172A',
				darkBlueLight: '#39445f',
				666: '#666',
				333: '#333',
				999: '#999'
			},
			fontSize: () => cloneDeep(PresetFontSizeConfig),
			borderRadius: () => cloneDeep(PresetRadiusConfig),
			gridTemplateColumns: {
				30: 'repeat(30, minmax(0, 1fr))',
				20: 'repeat(20, minmax(0, 1fr))'
			}
		},
		//直接覆盖，非继承
		spacing: () => cloneDeep(PresetSpacingConfig)
	}
}
