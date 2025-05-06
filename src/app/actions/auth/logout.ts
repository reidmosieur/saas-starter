'use server'

import { deleteSession } from '@/lib/session'
import { redirect } from 'next/navigation'

export async function logout() {
	try {
		await deleteSession()
	} catch (err) {
		console.error('Error deleting session: ', err)
		return
	}
	redirect('/login')
}

export async function handleLogout() {
	await logout()
}
