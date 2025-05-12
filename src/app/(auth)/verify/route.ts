import { verifyOTP } from '@/app/actions/auth/verify'
import { loginRoute } from '@/constants/routes'
import { redirect } from 'next/navigation'
import { type NextRequest } from 'next/server'

export function GET(request: NextRequest) {
	const searchParams = request.nextUrl.searchParams
	const token = searchParams.get('token')

	if (!token) {
		redirect(loginRoute)
	}

	return verifyOTP({ token })
}
