import { z } from 'zod'
import { passwordSchema } from './auth'
import { organizationSchema } from './organization'

export const usernameSchema = z
	.string()
	.min(4, { message: `Please provide a username that's at least 4 characters` })
	.max(16, {
		message: `Please provide a username that's at least 16 characters`,
	})
	.regex(/^[a-zA-Z0-9_]{3,20}$/, {
		message: `Please only use letters, numbers, and underscores`,
	})
	.trim()

export const firstNameSchema = z
	.string()
	.min(2, { message: `Please provide a first name` })
	.trim()
export const lastNameSchema = z
	.string()
	.min(2, { message: `Please provide a last name` })
	.trim()
export const countryCodeSchema = z.string().optional()
export const phoneNumberSchema = z.string().optional()

export const credentialsOnboardingStepSchema = z.object({
	username: usernameSchema,
	password: passwordSchema,
})

export const personalInfoOnboardingStepSchema = z.object({
	firstName: firstNameSchema,
	lastName: lastNameSchema,
	countryCode: countryCodeSchema,
	phoneNumber: phoneNumberSchema,
})

export const organizationOnboardingStepSchema = z.object({
	name: organizationSchema,
})