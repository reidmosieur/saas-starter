import { jwtVerify } from 'jose'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

// 1. Specify public routes
const publicRoutes = [
	'/login',
	'/signup',
	'/forgot-password',
	'/privacy',
	'/terms',
	'/verify',
	'/reset-password',
]

export default async function middleware(req: NextRequest) {
	// 2. Check if the current route is public
	const path = req.nextUrl.pathname
	const isPublicRoute = publicRoutes.includes(path)

	// 3. Decrypt the session from the cookie
    const cookie = (await cookies()).get('session')?.value

		if (!cookie && !isPublicRoute) {
			return NextResponse.redirect(new URL('/login', req.nextUrl))
		} else if (cookie) {
			// redefine the decrypt logic because prisma is unavailable in middleware
			const secretKey = process.env.SESSION_SECRET
			const encodedKey = new TextEncoder().encode(secretKey)
			const session = await jwtVerify(cookie, encodedKey, {
				algorithms: ['HS256'],
			})
			const sessionId = session?.payload.id as number | undefined

			// 4. Redirect to /login if the user is not authenticated
			if (!isPublicRoute && !sessionId) {
				return NextResponse.redirect(new URL('/login', req.nextUrl))
			}

			// 5. Redirect to / if the user is authenticated
			if (isPublicRoute && sessionId) {
				return NextResponse.redirect(new URL('/', req.nextUrl))
			}

			return NextResponse.next()
		}
}

// Routes Middleware should not run on
export const config = {
	matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
}
