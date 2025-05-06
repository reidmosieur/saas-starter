'use server'

import { PrismaClientKnownRequestError } from '@/generated/prisma/runtime/library'
import { generateCleanOTP } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { createSession, deleteSession } from '@/lib/session'
import {
	emailLoginSchema,
	emailSignUpSchema,
	verifyEmailSchema,
} from '@/schema/auth'
import bcrypt from 'bcrypt'
import { redirect } from 'next/navigation'

const hashSalt = 10

type RedirectTo = 'onboarding'

const safeError = {
	errors: {
		root: {
			message: 'Something went wrong',
		},
	},
}

export async function emailSignup({ email }: { email: string }) {
	// validate email sign up fields
	// the form is already validated once on the client but it's good
	// to validate twice to deter bad actors
	const validatedFields = emailSignUpSchema.safeParse({
		email,
	})

	// if any form fields are invalid, return early
	if (!validatedFields.success) {
		return {
			errors: validatedFields.error.flatten().fieldErrors,
		}
	}

	const { email: validatedEmail } = validatedFields.data

	// @ts-expect-error: TS complains because it isn't aware of the extension
	const existingUser: boolean = await prisma.user.exists({
		email: validatedEmail,
	})
	const safeError = {
		errors: {
			root: {
				message: 'An error occurred while creating your account', // returning a vague error prevents enumeration attacks
			},
		},
	}

	if (existingUser) {
		// optional: log that an account already exists

		// todo: send an email to the user asking if they're trying to log in

		return safeError
	}

	return await handleOTPSetup({
		email: validatedEmail,
		type: 'email-signup',
		redirectTo: 'onboarding',
	})
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

		// optional: store email in server-only cookie for UX if
		// user is likely to set up account on the same device
		// you could also set it up anyway and change the form
		// if the email cookie is available

		return redirect('/verify')
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
	} catch (err: any) {
		console.error(err?.message)
		return safeError
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

interface LoginArgs {
	email: string
	password: string
}

export async function login({ email, password }: LoginArgs) {
	try {
		const user = await prisma.user.findUniqueOrThrow({
			where: {
				email: email,
			},
			select: {
				id: true,
				password: {
					select: {
						hash: true,
					},
				},
			},
		})

		if (!user.password) {
			return safeError
		}

		const isValid = await bcrypt.compare(password, user.password?.hash)

		if (!isValid) {
			return {
				errors: {
					root: {
						message: `Your email or password don't match. Please try again.`,
					},
				},
			}
		}

		await createSession({
			userId: user.id,
			context: 'login',
		})
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
	} catch (err: any) {
		if (err instanceof PrismaClientKnownRequestError) {
			switch (err.code) {
				case 'P2025': // user isn't found
					// we'll still return safe error to avoid enumeration attacks
					// if you favor the security trade off for UX here you can
					// return a more accurate error
					return safeError

				default: // allow unhandled prisma errors to fall through
					console.info('Unhandled prisma error: ', err.code)
					break
			}
		}

		console.error(err?.message)

		return safeError
	}

	return redirect('/')
}

export async function handleLogin({ email, password }: LoginArgs) {
	// validate email login fields
	// the form is already validated once on the client but it's good
	// to validate twice to deter bad actors
	const validatedFields = emailLoginSchema.safeParse({
		email,
		password,
	})

	// if any form fields are invalid, return early
	if (!validatedFields.success) {
		return {
			errors: validatedFields.error.flatten().fieldErrors,
		}
	}

	const values = validatedFields.data

	return await login(values)
}

export async function logout() {
	try {
		await deleteSession()
	} catch (err) {
		console.error('Error deleting session: ', err)
		return
	}
	redirect('/login')
}

export async function hashPassword(passwordString: string) {
	return await bcrypt.hash(passwordString, hashSalt)
}
