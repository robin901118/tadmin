import { createProdMockServer } from 'vite-plugin-mock/es/createProdMockServer'
import mockData from './index'

export function setupProdMockServer() {
	createProdMockServer(mockData)
}
