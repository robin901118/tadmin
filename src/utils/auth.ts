import { token_key } from '@/config'

export function getToken(): string {
	return localStorage.getItem(token_key)
}

export function setToken(token: string) {
	return localStorage.setItem(token_key, token)
}

export function removeToken() {
	return localStorage.removeItem(token_key)
}
