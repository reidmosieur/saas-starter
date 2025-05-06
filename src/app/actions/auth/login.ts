'use server'

import { PrismaClientKnownRequestError } from '@/generated/prisma/runtime/library'
import prisma from '@/lib/prisma'
import { createSession } from '@/lib/session'
import { emailLoginSchema } from '@/schema/auth'
import { redirect } from 'next/navigation'
import bcrypt from 'bcrypt'

const safeError = {
	errors: {
		root: {
			message: 'Something went wrong. Try again',
		},
	},
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
