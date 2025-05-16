'use server'

import prisma from '@/lib/prisma'
import {
	credentialsOnboardingStepSchema,
	organizationOnboardingStepSchema,
	personalInfoOnboardingStepSchema,
	UsernameOnboardingStepFormProps,
	usernameOnboardingStepSchema,
} from '@/schema/account'
import { redirect } from 'next/navigation'
import { hashPassword } from '../auth'
import { getUserFromSession, getUserId } from '../user'
import { Prisma } from '@/generated/prisma'
import { logoutRoute } from '@/constants/routes'
import { permissionsArray } from '@/constants/permissions'
import {
	BillingOnboardingFormProps,
	billingOnboardingSchema,
} from '@/schema/organization'
import { createCustomer } from '../stripe'

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
		const currentUser = await prisma.user.findUniqueOrThrow({
			where: {
				id: userId,
			},
			select: {
				onboarding: {
					select: {
						stepTimeStamps: true,
						requiredSteps: true,
					},
				},
			},
		})
		const completedStep = 'CREDENTIALS'
		const updatedRequiredSteps = currentUser.onboarding?.requiredSteps.filter(
			(step) => step !== completedStep,
		)

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
						requiredSteps: {
							set: updatedRequiredSteps,
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

export async function completeUsernameOnboarding(
	values: UsernameOnboardingStepFormProps,
) {
	const userId = await getUserId()

	if (!userId) {
		redirect('/logout')
	}

	// Step 1:
	// validate email sign up fields
	// the form is already validated once on the client but it's good
	// to validate twice to deter bad actors
	const validatedFields = usernameOnboardingStepSchema.safeParse(values)

	// if any form fields are invalid, return early
	if (!validatedFields.success) {
		return {
			errors: validatedFields.error.flatten().fieldErrors,
		}
	}

	const { username } = validatedFields.data

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
						requiredSteps: true,
					},
				},
			},
		})
		const completedStep = 'USERNAME'
		const updatedRequiredSteps = currentUser.onboarding?.requiredSteps.filter(
			(step) => step !== completedStep,
		)

		updatedUser = await prisma.user.update({
			where: {
				id: userId,
			},
			data: {
				username,
				onboarding: {
					update: {
						currentStep: 'PERSONAL_INFO',
						completedSteps: {
							push: 'USERNAME',
						},
						stepTimeStamps: {
							CREDENTIALS: new Date(),
						},
						requiredSteps: {
							set: updatedRequiredSteps,
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
						requiredSteps: true,
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
		const updatedRequiredSteps = currentUser.onboarding?.requiredSteps.filter(
			(step) => step !== completedStep,
		)
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
						requiredSteps: {
							set: updatedRequiredSteps,
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

	let updatedUser

	try {
		const currentUser = await prisma.user.findUniqueOrThrow({
			where: {
				id: userId,
			},
			select: {
				email: true,
				onboarding: {
					select: {
						stepTimeStamps: true,
						requiredSteps: true,
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
		const updatedRequiredSteps = currentUser.onboarding?.requiredSteps.filter(
			(step) => step !== completedStep,
		)

		const newOrganization = await prisma.organization.create({
			data: {
				name,
			},
		})
		const newOrganizationId = newOrganization.id

		const newRole = await prisma.role.create({
			data: {
				name: 'Organization Owner',
				permissions: {
					connect: permissionsArray.map(({ key }) => ({ key })),
				},
				organizationId: newOrganizationId,
			},
		})

		const stripeCustomer = await createCustomer(currentUser.email)

		updatedUser = await prisma.user.update({
			where: {
				id: userId,
			},
			data: {
				organization: {
					connect: {
						id: newOrganizationId,
					},
					update: {
						stripeCustomerId: stripeCustomer.id,
					},
				},
				roles: {
					connect: {
						id: newRole.id,
					},
				},
				onboarding: {
					update: {
						currentStep: 'COMPLETED',
						completedSteps: {
							push: completedStep,
						},
						stepTimeStamps: updatedStamps,
						requiredSteps: {
							set: updatedRequiredSteps,
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
		console.error(err)

		return safeError
	}

	// here we'll mark onboarding as complete if everything looks good
	if (updatedUser.onboarding?.requiredSteps.includes('BILLING')) {
		redirect('/onboarding/billing')
	} else {
		redirect('/onboarding/complete')
	}
}

export async function completeBillingOnboarding(
	values: BillingOnboardingFormProps,
) {
	// Step 1:
	// validate email sign up fields
	// the form is already validated once on the client but it's good
	// to validate twice to deter bad actors
	const validatedFields = billingOnboardingSchema.safeParse(values)

	// if any form fields are invalid, return early
	if (!validatedFields.success) {
		return {
			errors: validatedFields.error.flatten().fieldErrors,
		}
	}

	const user = await getUserFromSession({
		id: true,
		organization: { select: { id: true } },
		onboarding: {
			select: {
				stepTimeStamps: true,
				requiredSteps: true,
			},
		},
	})

	if (!user || !user.organization) {
		redirect('/logout')
	}

	const { streetOne, streetTwo, state, city, zipCode, country } =
		validatedFields.data

	try {
		const completedStep = 'BILLING'
		const stepTimeStamps = (user.onboarding?.stepTimeStamps ??
			{}) as unknown as Record<string, Date>
		const updatedStamps = {
			...stepTimeStamps,
			[completedStep]: new Date(),
		}
		const updatedRequiredSteps = user.onboarding?.requiredSteps.filter(
			(step) => step !== completedStep,
		)

		await prisma.organization.update({
			where: {
				id: user.organization?.id,
			},
			data: {
				billingAddresses: {
					create: {
						type: 'BILLING',
						streetLineOne: streetOne,
						streetLineTwo: streetTwo,
						country,
						state: {
							connectOrCreate: {
								where: {
									name: state,
								},
								create: {
									name: state,
									slug: state,
								},
							},
						},
						city: {
							connectOrCreate: {
								where: {
									name_stateName: {
										name: city,
										stateName: state,
									},
								},
								create: {
									name: city,
									stateName: state,
								},
							},
						},
						zip: {
							connectOrCreate: {
								where: {
									cityName_stateName_code: {
										cityName: city,
										stateName: state,
										code: Number(zipCode),
									},
								},
								create: {
									cityName: city,
									stateName: state,
									code: Number(zipCode),
								},
							},
						},
					},
				},
			},
		})

		await prisma.user.update({
			where: {
				id: user.id,
			},
			data: {
				onboarding: {
					update: {
						currentStep: 'COMPLETED',
						completedSteps: {
							push: completedStep,
						},
						stepTimeStamps: updatedStamps,
						requiredSteps: {
							set: updatedRequiredSteps,
						},
					},
				},
			},
		})
	} catch (err) {
		console.error(err)

		return safeError
	}

	redirect('/onboarding/complete')
}