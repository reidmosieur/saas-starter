import {
	googleRedirectRoute,
	onboardingRoute,
	rootRoute,
	signupRoute,
} from '@/constants/routes'
import prisma from '@/lib/prisma'
import { createSession } from '@/lib/session'
import { OAuth2Client } from 'google-auth-library'
import { redirect } from 'next/navigation'
import { NextRequest } from 'next/server'

const oAuth2Client = new OAuth2Client({
	clientId: process.env.NEXT_PUBLIC_GOOGLE_OAUTH_CLIENT_ID,
	clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
	redirectUri: googleRedirectRoute,
})

export async function POST(req: NextRequest) {
	const formData = await req.text()
	const credential = new URLSearchParams(formData).get('credential')

	const searchParams = req.nextUrl.searchParams
	const userId = searchParams.get('connect')

	if (!credential) {
		return new Response(`Missing credentials`, {
			status: 400,
		})
	}

	const ticket = await oAuth2Client.verifyIdToken({
		idToken: credential,
		audience: process.env.GOOGLE_CLIENT_ID,
	})

	const payload = ticket.getPayload()

	if (!payload) {
		return new Response('No user info found', {
			status: 400,
		})
	}

	const { email, family_name, given_name, sub, email_verified } = payload

	if (!email) {
		return redirect(signupRoute)
	}

	// gmail emails are case-insensitive
	const normalizedEmail = email.toLowerCase()

	const existingConnection = await prisma.connection.findUnique({
		where: {
			provider_providerAccountId: {
				provider: 'GOOGLE',
				providerAccountId: sub,
			},
		},
		select: {
			id: true,
		},
	})
	const existingConnectionId = existingConnection?.id

	const existingUser = await prisma.user.findUnique({
		where: {
			id: Number(userId) ?? undefined,
			email: userId ? undefined : normalizedEmail,
		},
		select: {
			id: true,
			onboarded: true,
			onboarding: {
				select: {
					currentStep: true,
				},
			},
			connections: {
				select: {
					id: true,
					provider: true,
				},
			},
		},
	})

	if (
		existingConnectionId &&
		!existingUser?.connections.some(({ id }) => id === existingConnectionId)
	) {
		throw new Error(
			'A connection exists with that information for a different account',
		)
	}

	const googleConnectionExists =
		existingUser?.connections.some(({ provider }) => provider === 'GOOGLE') ??
		false

	if (existingUser) {
		const currentStep = existingUser.onboarding?.currentStep

		if (!googleConnectionExists) {
			// optional: have user confirm with their password or OTP to connect google
			await prisma.connection.create({
				data: {
					raw: JSON.stringify(payload),
					provider: 'GOOGLE',
					providerAccountId: sub,
					userId: existingUser.id,
					username: email,
				},
			})
		}

		await createSession({ userId: existingUser.id, context: 'google-login' })

		if (currentStep !== 'COMPLETED') {
			return redirect(onboardingRoute)
		}

		return redirect(rootRoute)
	} else if (!existingUser) {
		try {
			const user = await prisma.user.create({
				data: {
					email: normalizedEmail,
					emailVerified: email_verified ? new Date() : null,
					firstName: given_name,
					lastName: family_name,
					connections: {
						create: {
							raw: JSON.stringify(payload),
							provider: 'GOOGLE',
							providerAccountId: sub,
							username: email,
						},
					},
					onboarding: {
						create: {
							currentStep: 'USERNAME',
							requiredSteps: ['USERNAME', 'PERSONAL_INFO', 'ORGANIZATION'],
						},
					},
				},
			})

			await createSession({ userId: user.id, context: 'google-signup' })
		} catch (err) {
			console.error(err)

			return new Response('There was an unknown error', {
				status: 500,
			})
		}

		return redirect(onboardingRoute)
	}

	return new Response('There was an unknown error', {
		status: 500,
	})
}
