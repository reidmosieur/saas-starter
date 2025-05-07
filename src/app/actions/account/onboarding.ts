'use server'

import prisma from '@/lib/prisma'
import {
	credentialsOnboardingStepSchema,
	organizationOnboardingStepSchema,
	personalInfoOnboardingStepSchema,
} from '@/schema/account'
import { redirect } from 'next/navigation'
import { hashPassword } from '../auth'
import { getUserId } from '../user'

export async function completeCredentialsOnboarding(values: {
	username: string
	password: string
}) {
	// Step 1:
	// validate email sign up fields
	// the form is already validated once on the client but it's good
	// to validate twice to deter bad actors
	const validatedFields = credentialsOnboardingStepSchema.safeParse(values)

	// if any form fields are invalid, return early
	if (!validatedFields.success) {
		return {
			errors: validatedFields.error.flatten().fieldErrors,
		}
	}

	const userId = await getUserId()

	if (!userId) {
		redirect('/login')
	}

	const { username, password } = validatedFields.data

	const hashedPassword = await hashPassword(password)

	try {
		await prisma.user.update({
			where: {
				id: userId,
			},
			data: {
				username,
				password: {
					create: {
						hash: hashedPassword,
					},
				},
			},
		})
	} catch (err) {
		console.error(err)
	}

	redirect('/onboarding/personal-info')
}

export async function completePersonalInfoOnboarding(values: {
	firstName: string
	lastName: string
	countryCode?: string
	phoneNumber?: string
}) {
	// Step 1:
	// validate email sign up fields
	// the form is already validated once on the client but it's good
	// to validate twice to deter bad actors
	const validatedFields = personalInfoOnboardingStepSchema.safeParse(values)

	// if any form fields are invalid, return early
	if (!validatedFields.success) {
		return {
			errors: validatedFields.error.flatten().fieldErrors,
		}
	}

	const userId = await getUserId()

	if (!userId) {
		redirect('/login')
	}

	const { firstName, lastName, countryCode, phoneNumber } = validatedFields.data

	try {
		await prisma.user.update({
			where: {
				id: userId,
			},
			data: {
				firstName,
				lastName,
				phoneNumber:
					countryCode && phoneNumber
						? {
								create: {
									countryCode,
									number: phoneNumber,
								},
							}
						: undefined,
			},
		})
	} catch (err) {
		console.error(err)
	}

	redirect('/onboarding/organization')
}

export async function completeOrganizationOnboarding(values: { name: string }) {
	// Step 1:
	// validate email sign up fields
	// the form is already validated once on the client but it's good
	// to validate twice to deter bad actors
	const validatedFields = organizationOnboardingStepSchema.safeParse(values)

	// if any form fields are invalid, return early
	if (!validatedFields.success) {
		return {
			errors: validatedFields.error.flatten().fieldErrors,
		}
	}

	const userId = await getUserId()

	if (!userId) {
		redirect('/login')
	}

	const { name } = validatedFields.data

	try {
		await prisma.user.update({
			where: {
				id: userId,
			},
			data: {
				organization: {
					create: {
						name,
					},
				},
			},
		})
	} catch (err) {
		console.error(err)
	}

	redirect('/onboarding/complete')
}
