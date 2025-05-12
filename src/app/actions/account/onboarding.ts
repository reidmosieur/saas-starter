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
import { Prisma } from '@/generated/prisma'
import { logoutRoute } from '@/constants/routes'

const safeError = {
	errors: {
		root: {
			message: 'Something went wrong',
		},
	},
}

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
		redirect(logoutRoute)
	}

	const { username, password } = validatedFields.data

	const hashedPassword = await hashPassword(password)

	let updatedUser

	try {
		updatedUser = await prisma.user.update({
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
				onboarding: {
					update: {
						currentStep: 'PERSONAL_INFO',
						completedSteps: {
							push: 'CREDENTIALS',
						},
						stepTimeStamps: {
							CREDENTIALS: new Date(),
						},
					},
				},
			},
			select: {
				onboarding: {
					select: {
						requiredSteps: true,
					},
				},
			},
		})
	} catch (err) {
		if (err instanceof Prisma.PrismaClientKnownRequestError) {
			switch (err.code) {
				case 'P2002': // username failed unique constraint
					return {
						errors: {
							username: {
								message: 'That username is unavailable',
							},
						},
					}

				default:
					console.log('default reached')
			}
		}

		console.error(err)

		return safeError
	}

	if (updatedUser.onboarding?.requiredSteps.includes('PERSONAL_INFO')) {
		redirect('/onboarding/personal-info')
	} else {
		redirect('/onboarding/complete')
	}
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
		redirect('/logout')
	}

	const { firstName, lastName, countryCode, phoneNumber } = validatedFields.data

	let updatedUser

	try {
		const currentUser = await prisma.user.findUniqueOrThrow({
			where: {
				id: userId,
			},
			select: {
				onboarding: {
					select: {
						stepTimeStamps: true,
					},
				},
			},
		})

		const completedStep = 'PERSONAL_INFO'
		const stepTimeStamps = (currentUser.onboarding?.stepTimeStamps ??
			{}) as unknown as Record<string, Date>
		const updatedStamps = {
			...stepTimeStamps,
			[completedStep]: new Date(),
		}
		updatedUser = await prisma.user.update({
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
				onboarding: {
					update: {
						currentStep: 'ORGANIZATION',
						completedSteps: {
							push: completedStep,
						},
						stepTimeStamps: updatedStamps,
					},
				},
			},
			select: {
				onboarding: {
					select: {
						requiredSteps: true,
					},
				},
			},
		})
	} catch (err) {
		console.error(err)

		return safeError
	}

	if (updatedUser.onboarding?.requiredSteps.includes('ORGANIZATION')) {
		redirect('/onboarding/organization')
	} else {
		redirect('/onboarding/complete')
	}
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
		redirect('/logout')
	}

	const { name } = validatedFields.data

	try {
		const currentUser = await prisma.user.findUniqueOrThrow({
			where: {
				id: userId,
			},
			select: {
				onboarding: {
					select: {
						stepTimeStamps: true,
					},
				},
			},
		})

		const completedStep = 'ORGANIZATION'
		const stepTimeStamps = (currentUser.onboarding?.stepTimeStamps ??
			{}) as unknown as Record<string, Date>
		const updatedStamps = {
			...stepTimeStamps,
			[completedStep]: new Date(),
		}

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
				onboarding: {
					update: {
						currentStep: 'COMPLETED',
						completedSteps: {
							push: completedStep,
						},
						stepTimeStamps: updatedStamps,
					},
				},
			},
		})
	} catch (err) {
		console.error(err)

		return safeError
	}

	// here we'll mark onboarding as complete if everything looks good
	redirect('/onboarding/complete')
}
