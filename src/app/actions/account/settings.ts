'use server'

import {
	emailSettingsForm,
	personalInfoSettingsForm,
	phoneNumberSettingsForm,
} from '@/schema/account'
import { getUserId } from '../user'
import { redirect } from 'next/navigation'
import prisma from '@/lib/prisma'

const safeError = {
	errors: {
		root: {
			message: 'There was an error',
		},
	},
}

export async function updatePersonalInfoSettings(values: {
	firstName: string
	lastName: string
	username: string
}) {
	const userId = await getUserId()

	if (!userId) {
		redirect('/logout')
	}

	// Step 1:
	// validate email sign up fields
	// the form is already validated once on the client but it's good
	// to validate twice to deter bad actors
	const validatedFields = personalInfoSettingsForm.safeParse(values)

	// if any form fields are invalid, return early
	if (!validatedFields.success) {
		return {
			errors: validatedFields.error.flatten().fieldErrors,
		}
	}

	const { firstName, lastName, username } = validatedFields.data

	try {
		await prisma.user.update({
			where: {
				id: userId,
			},
			data: {
				firstName,
				lastName,
				username,
			},
		})

		return
	} catch (err) {
		console.error(err)

		return safeError
	}
}

export async function updateEmailSettings(values: { email: string }) {
	const userId = await getUserId()

	if (!userId) {
		redirect('/logout')
	}

	// Step 1:
	// validate email sign up fields
	// the form is already validated once on the client but it's good
	// to validate twice to deter bad actors
	const validatedFields = emailSettingsForm.safeParse(values)

	// if any form fields are invalid, return early
	if (!validatedFields.success) {
		return {
			errors: validatedFields.error.flatten().fieldErrors,
		}
	}

	const { email } = validatedFields.data

	try {
		await prisma.user.update({
			where: {
				id: userId,
			},
			data: {
				email,
			},
		})

		return
	} catch (err) {
		console.error(err)

		return safeError
	}
}

export async function updatePhoneNumberSettings(values: {
	countryCode: string
	phoneNumber: string
}) {
	const userId = await getUserId()

	if (!userId) {
		redirect('/logout')
	}

	// Step 1:
	// validate email sign up fields
	// the form is already validated once on the client but it's good
	// to validate twice to deter bad actors
	const validatedFields = phoneNumberSettingsForm.safeParse(values)

	// if any form fields are invalid, return early
	if (!validatedFields.success) {
		return {
			errors: validatedFields.error.flatten().fieldErrors,
		}
	}

	const { countryCode, phoneNumber: number } = validatedFields.data

	try {
		await prisma.user.update({
			where: {
				id: userId,
			},
			data: {
				phoneNumber: {
					upsert: {
						create: {
							countryCode,
							number,
						},
						update: {
							countryCode,
							number,
						},
					},
				},
			},
		})

		return
	} catch (err) {
		console.error(err)

		return safeError
	}
}
