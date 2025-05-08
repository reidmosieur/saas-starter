'use server'

import prisma from '@/lib/prisma'
import { forgotPasswordSchema } from '@/schema/auth'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { handleOTPSetup } from './verify'
import { resetPasswordCookieName } from '@/constants/auth'

const safeError = {
	errors: {
		root: {
			message: 'Something went wrong',
		},
	},
}

export async function initializeForgotPassword({ email }: { email: string }) {
	// Step 1:
	// validate email sign up fields
	// the form is already validated once on the client but it's good
	// to validate twice to deter bad actors
	const validatedFields = forgotPasswordSchema.safeParse({
		email,
	})

	// if any form fields are invalid, return early
	if (!validatedFields.success) {
		return {
			errors: validatedFields.error.flatten().fieldErrors,
		}
	}

	const { email: validatedEmail } = validatedFields.data

	// Step 2:
	// check for an existing user with that email
	const existingUser = await prisma.user.findUniqueOrThrow({
		where: {
			email,
		},
		select: {
			password: true,
		},
	})

	// if a user isn't found return a safe error to avoid enumeration attacks
	if (!existingUser || !existingUser.password) {
		// todo: alert the user of their login method if the password isn't found

		return safeError
	}

	// Step 3:
	// create and send the OTP to the email
	try {
		await handleOTPSetup({
			email: validatedEmail,
			type: 'forgot-password',
			redirectTo: 'reset-password',
		})
	} catch (err) {
		console.error(err)

		return safeError
	}

	// Step 4:
	// redirect the user to the verification route
	// the user get's a link emailed as well
	redirect('/verify')
}

export async function completeForgotPassword({ email }: { email: string }) {
	const resetPasswordToken = crypto.randomUUID()
	await prisma.user.update({
		where: {
			email,
		},
		data: {
			resetPasswordInitialized: new Date(),
			resetPasswordToken,
			password: {
				delete: true,
			},
		},
	})

	const cookieStore = await cookies()
	cookieStore.set(resetPasswordCookieName, resetPasswordToken, {
		httpOnly: true,
		secure: true,
		sameSite: 'strict',
		maxAge: 15 * 60,
	})
}
