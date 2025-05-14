'use server'

import { hashSalt } from '@/constants/auth'
import bcrypt from 'bcrypt'
import { redirect } from 'next/navigation'
import { verifyEmailSchema } from '@/schema/auth'
import { OtpType, RedirectTo } from '@/types/auth'
import prisma from '@/lib/prisma'
import { PrismaClientKnownRequestError } from '@/generated/prisma/runtime/library'
import { randomInt } from 'crypto'
import { cookies } from 'next/headers'
import { completeEmailSignup } from './signup'
import { completeForgotPassword } from './forgot-password'
import { jwtVerify, SignJWT } from 'jose'
import {
	loginRoute,
	onboardingRoute,
	resetPasswordRoute,
	verifyRoute,
} from '@/constants/routes'
import { OTP } from '@/generated/prisma'
import { completeOrganizationInvitation } from '../organization'

const safeError = {
	errors: {
		root: {
			message: 'There was an error. Try again',
		},
	},
}

const secretKey = process.env.SESSION_SECRET
const encodedKey = new TextEncoder().encode(secretKey)

// Expiration duration
const OTP_EXPIRATION_SECONDS = 10 * 60 // 10 minutes

export async function handleOTPSetup({
	email,
	type,
	redirectTo,
}: {
	email: string
	type: OtpType
	redirectTo: RedirectTo
}) {
	try {
		// Step 1:
		// generate a code and hash it
		const code = await generateCleanOTP()
		const codeHash = await bcrypt.hash(code, hashSalt)

		// Step 2:
		// create the record
		const otp = await prisma.oTP.create({
			data: {
				email,
				codeHash,
				type,
				redirectTo,
			},
		})

		if (!otp) {
			return safeError
		}

		// Step 2:
		// add the otp id as a server only cookie to reference later
		// if the generation method isn't an invite
		if (type !== 'organization-invite') {
			const cookieStore = await cookies()
			cookieStore.set('otp_session', otp.id.toString(), {
				httpOnly: true,
				secure: true,
				sameSite: 'strict',
				maxAge: 600, // 10 minutes
				path: '/',
			})
		}

		const jwt = await new SignJWT({
			email,
			type,
			otpId: otp.id,
			redirectTo,
		})
			.setProtectedHeader({ alg: 'HS256' })
			.setIssuedAt()
			.setExpirationTime(`${OTP_EXPIRATION_SECONDS}s`)
			.sign(encodedKey)

		const verifyUrl = `${process.env.NEXT_PUBLIC_APP_URL}/${verifyRoute}?token=${jwt}`

		// Step 3:
		// email the code to the user
		// todo: implement email with resend
		console.info('The OTP is: ', code, '\nVerification url is: ', verifyUrl)
	} catch (err) {
		if (err instanceof PrismaClientKnownRequestError) {
			switch (err.code) {
				case 'P2025': // email already has an OTP
					// email the user

					return safeError

				default: // allow to fall through
					console.info(err.code)
			}
		}

		console.error(err)

		throw new Error('There was an unhandled error creating the OTP')
	}
}

export async function getOTPFromCookie(): Promise<OTP | null> {
	const cookieStore = await cookies()
	const otpIdCookie = cookieStore.get('otp_session')?.value
	if (!otpIdCookie) return null

	const otpId = Number(otpIdCookie)

	return prisma.oTP.findUnique({
		where: { id: otpId },
	})
}

export async function getOTPFromToken(token: string): Promise<OTP | null> {
	try {
		const { payload } = await jwtVerify(token, encodedKey)
		const otpId = payload.otpId as string
		if (!otpId) return null

		return await prisma.oTP.findUnique({
			where: { id: Number(otpId) },
		})
	} catch (err) {
		console.error('Invalid or expired OTP token', err)
		return null
	}
}

export async function completeOTPFlow(otp: OTP) {
	const { type, email, redirectTo, codeHash } = otp

	// Cleanup
	await prisma.oTP.delete({
		where: { codeHash },
	})

	// Flow-specific logic
	switch (type as OtpType) {
		case 'email-signup':
			await completeEmailSignup({ email })
			break
		case 'forgot-password':
			await completeForgotPassword({ email })
			break
		case 'organization-invite':
			await completeOrganizationInvitation({ email })
			break
		default:
			console.warn('Unhandled OTP type:', type)
	}

	// Redirection
	switch (redirectTo as RedirectTo) {
		case 'onboarding':
			redirect(onboardingRoute)
		case 'reset-password':
			redirect(resetPasswordRoute)
		default:
			return safeError
	}
}

export async function verifyOTP({
	code,
	token,
}: {
	code?: string
	token?: string
}) {
	let otp: OTP | null = null

	if (token) {
		otp = await getOTPFromToken(token)
		if (!otp) {
			redirect(loginRoute)
		}
		// No need to check code if token-based
		return completeOTPFlow(otp)
	}

	// Fallback to code + cookie flow
	const validatedFields = verifyEmailSchema.safeParse({ code })
	if (!validatedFields.success) {
		return { errors: validatedFields.error.flatten().fieldErrors }
	}

	otp = await getOTPFromCookie()
	if (!otp) return safeError

	const isValid = await bcrypt.compare(validatedFields.data.code, otp.codeHash)
	if (!isValid) return safeError

	return completeOTPFlow(otp)
}

export async function generateCleanOTP(length = 6) {
	// for UX, we'll remove confusing characters and only use uppercase characters
	// Removes: O (letter), 0 (zero), I (uppercase i), 1 (one), L
	const chars = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789'
	return Array.from({ length }, () => chars[randomInt(0, chars.length)]).join(
		'',
	)
}
