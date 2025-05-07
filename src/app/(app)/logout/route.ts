import { NextResponse } from 'next/server'
import { handleLogout } from '@/app/actions/auth/logout'

export async function GET() {
	await handleLogout()
	return NextResponse.redirect('/login')
}
