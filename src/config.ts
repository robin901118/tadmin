//登录的时候账号密码存在cookie里的字段名
export const login_info_key: string = 't-admin-login-form'
//登录的时候手机号码存在cookie里的字段名
export const login_info_mobile: string = 't-admin-login-mobile'
//账号密码自动填充在cookie里过期的时间(单位：天)
export const login_info_expires: any = 7
//登录的时候，获取短信验证码间隔，按【秒】为单位
export const get_sms_duration: number = 60
// token在缓存里的字段名
export const token_key: string = 't-admin-token'
// 请求header里面token的字段名称
export const request_header_token: string = 'i84-dubbo-Token'
// 存在缓存里的主题颜色字段名
export const theme_key: string = 't-admin-theme'
// 缓存里字典字段名
export const catch_dict_key: string = 't-admin-global-dict'
// 默认主题色
export const default_theme_color: string = '#409EFF'
// 静默请求错误集合【这个集合里面的错误码不进行错误弹窗提示】
export const code_white_list: Set<number> = new Set([5000])
// TImgUpload组件的签名在缓存中存储的字段名
export const oss_sign: string = 't-admin-sign'
