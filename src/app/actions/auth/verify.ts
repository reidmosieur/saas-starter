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

const safeError = {
	errors: {
		root: {
			message: 'There was an error. Try again',
		},
	},
}

export async function handleOTPSetup({
	email,
	type,
	redirectTo,
}: {
	email: string
	type: string
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
		const cookieStore = await cookies()
		cookieStore.set('otp_session', otp.id.toString(), {
			httpOnly: true,
			secure: true,
			sameSite: 'strict',
			maxAge: 600, // 10 minutes
			path: '/',
		})

		// Step 3:
		// email the code to the user
		// todo: implement email with resend
		console.info('The OTP is: ', code)
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

interface VerifyOTPArgs {
	code: string
}

export async function verifyOTP({ code }: VerifyOTPArgs) {
	// Step 1:
	// validate email sign up fields
	// the form is already validated once on the client but it's good
	// to validate twice to deter bad actors
	const validatedFields = verifyEmailSchema.safeParse({
		code,
	})

	// if any form fields are invalid, return early
	if (!validatedFields.success) {
		return {
			errors: validatedFields.error.flatten().fieldErrors,
		}
	}

	// Step 2:
	// find the users OTP by the OTP cookie
	const cookieStore = await cookies()
	const otpIdCookie = cookieStore.get('otp_session')?.value

	if (!otpIdCookie) return safeError

	const otpId = Number(otpIdCookie)

	const otp = await prisma.oTP.findUnique({
		where: {
			id: otpId,
		},
		select: {
			codeHash: true,
			redirectTo: true,
			email: true,
			type: true,
		},
	})

	if (!otp) {
		return {
			errors: {
				root: {
					message: 'Something went wrong. Please try again',
				},
			},
		}
	}

	// Step 3:
	// compare the code to make sure it matches
	const { code: validatedCode } = validatedFields.data
	const isValid = await bcrypt.compare(validatedCode, otp?.codeHash)

	if (!isValid) {
		// optional: add in limit to OTP compares
		return safeError
	}

	// Step 4:
	// clean up the database
	// clean ups are also performed every 30 days with cron jobs
	await prisma.oTP.delete({
		where: {
			codeHash: otp.codeHash,
		},
	})

	// Step 5:
	// complete authorization flows based on the OTP type
	const otpType = otp.type as OtpType
	const email = otp.email

	switch (otpType) {
		case 'email-signup':
			await completeEmailSignup({ email })
			break

		case 'forgot-password':
			await completeForgotPassword({ email })
			break

		default:
			console.log('default reached in otp type block')
			break
	}

	// Step 6:
	// redirect the user based on the authorization flow
	const redirectTo = otp.redirectTo as RedirectTo
	switch (redirectTo) {
		case 'onboarding':
			redirect(`/onboarding`)

		case 'reset-password':
			redirect('/reset-password')

		default: // something weird happened. Let's return safeError
			console.log('default reached in redirect to block')
			return safeError
	}
}

export async function handleVerifyOTP({ code }: VerifyOTPArgs) {
	// validate email sign up fields
	// the form is already validated once on the client but it's good
	// to validate twice to deter bad actors
	const validatedFields = verifyEmailSchema.safeParse({
		code,
	})

	// if any form fields are invalid, return early
	if (!validatedFields.success) {
		return {
			errors: validatedFields.error.flatten().fieldErrors,
		}
	}

	const values = validatedFields.data

	if (!values) {
		return safeError
	}

	return await verifyOTP(values)
}

export async function generateCleanOTP(length = 6) {
	// for UX, we'll remove confusing characters and only use uppercase characters
	// Removes: O (letter), 0 (zero), I (uppercase i), 1 (one), L
	const chars = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789'
	return Array.from({ length }, () => chars[randomInt(0, chars.length)]).join(
		'',
	)
}
