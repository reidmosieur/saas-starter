import { z } from 'zod'

const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/
export const usernameSchema = z
	.string()
	.min(4)
	.max(16)
	.superRefine((value) => usernameRegex.test(value))

export const firstNameSchema = z.string()
export const lastNameSchema = z.string()

export const phoneNumberSchema = z.object({
	countryCode: z.string(), // todo: enum for country codes
	number: z.string(), //todo: phone "number" refinement
})
