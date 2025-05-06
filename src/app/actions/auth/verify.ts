'use server'

import { hashSalt } from '@/constants/auth'
import bcrypt from 'bcrypt'
import { redirect } from 'next/navigation'
import { verifyEmailSchema } from '@/schema/auth'
import { RedirectTo } from '@/types/auth'
import prisma from '@/lib/prisma'
import { PrismaClientKnownRequestError } from '@/generated/prisma/runtime/library'
import { randomInt } from 'crypto'

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
		const code = generateCleanOTP()
		const codeHash = await bcrypt.hash(code, hashSalt)

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
	email: string
}

export async function verifyOTP({ code, email }: VerifyOTPArgs) {
	const otp = await prisma.oTP.findUnique({
		where: {
			email,
		},
		select: {
			codeHash: true,
			redirectTo: true,
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

	const isValid = await bcrypt.compare(code, otp?.codeHash)

	if (!isValid) {
		// optional: add in limit to OTP compares
		return safeError
	}

	await prisma.oTP.delete({
		where: {
			codeHash: otp.codeHash,
		},
	})

	const redirectTo = otp.redirectTo

	switch (redirectTo) {
		case 'onboarding':
			return redirect(`/onboarding?email=${email}`)

		default:
			console.log('default reached')
			break
	}
}

export async function handleVerifyOTP({ email, code }: VerifyOTPArgs) {
	// validate email sign up fields
	// the form is already validated once on the client but it's good
	// to validate twice to deter bad actors
	const validatedFields = verifyEmailSchema.safeParse({
		email,
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

export function generateCleanOTP(length = 6): string {
	// for UX, we'll remove confusing characters and only use uppercase characters
	// Removes: O (letter), 0 (zero), I (uppercase i), 1 (one), L
	const chars = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789'
	return Array.from({ length }, () => chars[randomInt(0, chars.length)]).join(
		'',
	)
}
