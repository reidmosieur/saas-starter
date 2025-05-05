import { z } from 'zod'

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

export const phoneNumberSchema = z.object({
	countryCode: z.string().optional(), // todo: enum for country codes
	number: z.string().optional(), //todo: phone "number" refinement
})

export const onboardingSchema = z.object({
	username: usernameSchema,
	firstName: firstNameSchema,
	lastName: lastNameSchema,
	phoneNumber: phoneNumberSchema.optional(),
})