import userApis from './user'
import menuApis from './menu'
import dictApis from './dictionary'
import roleApis from './role'
import departApis from './department'
import tenantApis from './tenant'
import systemApis from './system'
import topmenuApis from './topmenu'
import paramApis from './param'
import taskApis from './task'
import logApis from './log'
import { MockMethod } from 'vite-plugin-mock'

export default [...userApis(), ...menuApis(), ...dictApis(), ...roleApis(), ...departApis(), ...tenantApis(), ...systemApis(), ...topmenuApis(), ...paramApis(), ...taskApis(), ...logApis()] as MockMethod[]
