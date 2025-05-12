import 'server-only'
import { SignJWT, jwtVerify } from 'jose'
import { cookies, headers } from 'next/headers'
import prisma from './prisma'
import { InputJsonObject } from '@/generated/prisma/runtime/library'
import { IpInfoResponse } from '@/types/session'
import { userAgent } from 'next/server'

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
		console.error('Failed to verify session', error)
	}
}

export async function createSession({
	userId,
	expiresAt = in30Days,
	context,
	metadata,
}: {
	userId: number
	expiresAt?: Date | undefined
	context: string
	metadata?: InputJsonObject
}) {
	try {
		const headersList = await headers()
		const forwardedFor = headersList.get('x-forwarded-for')

		const userAgentData = userAgent({ headers: headersList })

		const ipInfo = await getIpLocation(forwardedFor ?? undefined)

		const { id, expiresAt: sessionExpiresAt } = await prisma.session.create({
			data: {
				userId,
				expiresAt,
				ipAddress: forwardedFor,
				// user agent data
				ua: userAgentData?.ua,
				isBot: userAgentData?.isBot,
				browserName: userAgentData?.browser.name,
				browserVersion: userAgentData?.browser.version,
				browserMajor: userAgentData?.browser.major,
				deviceModel: userAgentData?.device.model,
				deviceType: userAgentData?.device.type,
				deviceVendor: userAgentData?.device.vendor,
				engineName: userAgentData?.engine.name,
				engineVersion: userAgentData?.engine.version,
				osName: userAgentData?.os.name,
				osVersion: userAgentData?.os.version,
				cpuArchitecture: userAgentData?.cpu.architecture,
				// ip info
				hostname: ipInfo?.hostname,
				city: ipInfo?.city,
				region: ipInfo?.region,
				country: ipInfo?.country,
				loc: ipInfo?.loc,
				org: ipInfo?.org,
				postal: ipInfo?.postal,
				timezone: ipInfo?.timezone,
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
			sameSite: 'strict',
			path: '/',
		})
	} catch (err) {
		console.error(err)

		return
	}
}

export async function readSession() {
	const cookie = (await cookies()).get('session')?.value

	const sessionCookie = await decrypt(cookie)
	const sessionId = sessionCookie?.id as number | undefined

	const session = await prisma.session.findUnique({
		where: {
			id: sessionId,
		},
		select: {
			userId: true,
		},
	})

	return session
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

	const sessionId = payload.id as number

	await prisma.session.update({
		where: {
			id: sessionId,
		},
		data: {
			expiresAt,
		},
	})

	const cookieStore = await cookies()
	cookieStore.set('session', session, {
		httpOnly: true,
		secure: true,
		expires: expiresAt,
		sameSite: 'strict',
		path: '/',
	})
}

export async function deleteSession() {
	const session = (await cookies()).get('session')?.value
	const payload = await decrypt(session)

	if (!session || !payload) {
		return null
	}

	const sessionId = payload.id as number

	try {
		await prisma.session.update({
			where: {
				id: sessionId,
			},
			data: {
				revokedAt: new Date(),
			},
		})
	} catch (err) {
		console.error('Error deleting session', err)
	}

	const cookieStore = await cookies()
	cookieStore.delete('session')
}

// ignore missing or local IPs
const ignoredIps = ['::1', undefined]
export async function getIpLocation(ip: string | undefined) {
	if (ignoredIps.includes(ip)) return undefined

	try {
		const ipInfoApiKey = process.env.IP_INFO_API_KEY

		if (!ipInfoApiKey) throw new Error('IPinfo API key is required')

		const response = await fetch(
			`https://ipinfo.io/${ip}/json?token=${ipInfoApiKey}`,
		)
		const data: IpInfoResponse = await response.json()

		return data
	} catch (err) {
		console.error(err)
		return undefined
	}
}