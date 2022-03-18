/* 用户类 */
declare interface UserBase {
	//头像
	avatar: string
	//手机
	phone: string
	//昵称
	name: string
	//真实姓名
	realName: string
	//性别
	sex: number
	//用户id
	userId: number | string
	//租户id
	tenantId: string | number
	//角色id
	roleId: string | number
	//状态
	status: number
	//部门id
	deptId: number | string
	//邮箱
	email: string
	//密码
	password: string
	//账号
	account: string
	//生日
	birthday: string
	//用户token
	token: string
	//角色id
	roleIds: string
	//所属租户
	tenantName: string
	//用户类型
	userType: string | number
	//顶部授权菜单
	topmenus: Array<{
		sort: number
		topmenuCode: string
		topmenuIcon: string
		topmenuId: number
		topmenuName: string
	}>
	//是否是超级用户
	isSuper: 0 | 1
}

/* 字典类 */
declare interface DictBase {
	//字典名称
	dictName: string
	//字典编号
	dictNo: string
	//字典id
	dictId: string | number
	//字典描述
	dictDesc: string
	//创建时间
	createTime?: string
	//创建人
	createUser?: string
	//字典配置id
	dictGroupId: string | number
	//字典配置名
	groupText: string
	//字典配置值
	groupValue: unknown
	//字典配置排序
	sortOrder: number
	//字典配置状态
	status: 1 | 2
	//字典配置描述
	groupDescribe: string
}

/* 租户类 */
declare interface TenantBase {
	//主键
	tenantId: number | string
	//租户名称
	tenantName: string
	//联系人
	linkName: string
	//联系电话
	linkPhone: string
	//联系地址
	linkAddress: string
	//账号额度
	accountLimit: number
	//失效时间
	invalidTime: string
	//字典配置状态 1->启用 2->禁用
	status: 1 | 2
}

/* 角色类 */
declare interface RoleBase {
	//主键
	roleId: number | string
	//角色名称
	roleName: string
	//角色描述
	description: string
	//租户主键
	tenantId: number | string
	//创建人
	createUser: number
	//创建时间
	createTime: string
	//修改人
	updateUser: number
	//修改时间
	updateTime: string
	//是否删除 1正常 2删除
	isDeleted: 1 | 2
}

/* 菜单类 */
declare interface MenuBase {
	//主键
	menuId: number | string
	//父类主键
	parentId: number | string
	//菜单名称
	menuName: string
	//路由名称
	routeName: string
	//菜单路径
	menuPath: string
	//菜单类型
	menuType: 1 | 2 | 3
	//默认路径
	defaultPath: string
	//路由状态 1显示 2不显示
	routeStatus: number
	//排序
	sort: number
	//菜单图标
	menuIcon: string
	//前端组件
	assembly: string
	//创建人
	createUser: number
	//创建时间
	createTime: string
	//修改人
	updateUser: number
	//修改时间
	updateTime: string
	//是否删除 1正常 2删除
	isDeleted: 1 | 2
	//授权标识
	grantCode: string
	//授权策略
	grantType: 1 | 2
	//授权状态
	grantStatus: 1 | 2
	//是否是外链
	isOutLinks: 1 | 2
}

/* 任务类 */
declare interface TaskBase {
	//定时任务名称
	name: string
	//执行类
	clazz: string
	//描述
	description: string
	//cron表达式
	cron: string
	//status :NORMAL：正常 PAUSE：暂停 ERROR：错误
	status: 'NORMAL' | 'PAUSE' | 'ERROR'
	//开始时间
	startTime: string
	// 结束时间
	endTime: string
	// 下次执行时间
	nextFireTime: string
	// 参数信息
	jobDataMap: string
}

/* 日志类 */
declare interface LogBase {
	//文件名称
	fileName: string
	//日志级别
	level: string
	//文件路径
	path: string
	//日志类型
	type: string
}

/* 顶部菜单类 */
declare interface TopMenu {
	//顶部菜单编号
	topmenuCode: string
	//顶部菜单图标
	topmenuIcon: string
	//顶部菜单名称
	topmenuName: string
	//排序
	sort: number
	//键
	topmenuId: number | string
	//授权的菜单集合
	menuIds: string
}

/*业务类*/
declare interface Business {
	paramId: number | string
	paramKey: string
	paramName: string
	paramValue: string
	remark: string
}
