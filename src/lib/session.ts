import 'server-only'
import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'
import prisma from './prisma'
import { InputJsonObject } from '@/generated/prisma/runtime/library'

const secretKey = process.env.SESSION_SECRET
const encodedKey = new TextEncoder().encode(secretKey)

const in30Days = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)

export async function encrypt({
	id,
	expiresAt = in30Days,
}: {
	id: number
	expiresAt: Date | undefined
}) {
	return new SignJWT({ id, expiresAt })
		.setProtectedHeader({ alg: 'HS256' })
		.setIssuedAt()
		.setExpirationTime('7d')
		.sign(encodedKey)
}

export async function decrypt(session: string | undefined = '') {
	try {
		const { payload } = await jwtVerify(session, encodedKey, {
			algorithms: ['HS256'],
		})
		return payload
	} catch (error) {
		console.log('Failed to verify session', error)
	}
}

export async function createSession({
	userId,
	expiresAt = in30Days,
	ipAddress,
	userAgent,
	context,
	metadata,
}: {
	userId: number
	expiresAt: Date | undefined
	ipAddress: string
	userAgent: string
	context: string
	metadata: InputJsonObject
}) {
	const { id, expiresAt: sessionExpiresAt } = await prisma.session.create({
		data: {
			userId,
			expiresAt,
			ipAddress,
			userAgent,
			context,
			metadata,
		},
	})

	const session = await encrypt({
		id,
		expiresAt: sessionExpiresAt ?? undefined,
	})

	const cookieStore = await cookies()
	cookieStore.set('session', session, {
		httpOnly: true,
		secure: true,
		expires: sessionExpiresAt ?? undefined,
		sameSite: 'lax',
		path: '/',
	})
}

export async function updateSession({
	expiresAt = in30Days,
}: {
	expiresAt: Date | undefined
}) {
	const session = (await cookies()).get('session')?.value
	const payload = await decrypt(session)

	if (!session || !payload) {
		return null
	}

	const cookieStore = await cookies()
	cookieStore.set('session', session, {
		httpOnly: true,
		secure: true,
		expires: expiresAt,
		sameSite: 'lax',
		path: '/',
	})
}

export async function deleteSession() {
	const cookieStore = await cookies()
	cookieStore.delete('session')
}
