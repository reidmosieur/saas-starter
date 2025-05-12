import { NextResponse } from 'next/server'
import { handleLogout } from '@/app/actions/auth/logout'
import { loginRoute } from '@/constants/routes'

export async function GET() {
	await handleLogout()
	return NextResponse.redirect(loginRoute)
}
