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
	.min(2, { message: `Please provide a name that's at least 2 characters` })
	.trim()
export const lastNameSchema = z
	.string()
	.min(2, { message: `Please provide a name that's at least 2 characters` })
	.trim()

export const phoneNumberSchema = z.object({
	countryCode: z.string(), // todo: enum for country codes
	number: z.string(), //todo: phone "number" refinement
})
