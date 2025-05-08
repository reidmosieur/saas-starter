'use server'

import prisma from '@/lib/prisma'
import { resetPasswordSchema } from '@/schema/auth'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { hashPassword } from '.'
import { resetPasswordCookieName } from '@/constants/auth'

const safeError = {
	errors: {
		root: {
			message: 'Something went wrong',
		},
	},
}

export async function resetPassword({
	password,
	verifyPassword,
}: {
	password: string
	verifyPassword: string
}) {
	// Step 1:
	// validate email sign up fields
	// the form is already validated once on the client but it's good
	// to validate twice to deter bad actors
	const validatedFields = resetPasswordSchema.safeParse({
		password,
		verifyPassword,
	})

	// if any form fields are invalid, return early
	if (!validatedFields.success) {
		return {
			errors: validatedFields.error.flatten().fieldErrors,
		}
	}

	const cookieStore = await cookies()
	const resetPasswordToken = cookieStore.get(resetPasswordCookieName)?.value

	if (!resetPasswordToken) {
		return safeError
	}

	let user
	try {
		user = await prisma.user.findUniqueOrThrow({
			where: {
				resetPasswordToken,
			},
			select: {
				id: true,
			},
		})
	} catch (err) {
		console.error(err)

		return safeError
	}

	const { password: validatedPassword } = validatedFields.data
	const hash = await hashPassword(validatedPassword)

	try {
		await prisma.password.create({
			data: {
				hash,
				user: {
					connect: {
						id: user.id,
					},
				},
			},
		})
	} catch (err) {
		console.error(err)

		return safeError
	}
	cookieStore.delete(resetPasswordCookieName)

	redirect('/login')
}
