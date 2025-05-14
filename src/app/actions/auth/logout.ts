'use server'

import { revokeCurrentSession } from '@/lib/session'
import { redirect } from 'next/navigation'

export async function logout() {
	try {
		await revokeCurrentSession()
	} catch (err) {
		console.error('Error deleting session: ', err)
		return
	}
	redirect('/login')
}

export async function handleLogout() {
	await logout()
}
