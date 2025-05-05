import { z } from 'zod'

export const passwordSchema = z
	.string()
	.min(8, {
		message: `Please provide a password that's at least 8 characters long`,
	})
	.regex(/[a-zA-Z]/, {
		message: `Please provide a password that contains at least one letter.`,
	})
	.regex(/[0-9]/, {
		message: 'Please provide a password that contains at least one number.',
	})
	.regex(/[^a-zA-Z0-9]/, {
		message:
			'Please provide a password that contains at least one special character.',
	})

export const emailSchema = z
	.string()
	.email({ message: 'Please provide a valid email' })

export const emailSignUpSchema = z.object({
	email: emailSchema,
	password: passwordSchema,
})

export const emailLoginSchema = z.object({
	email: emailSchema,
	password: z.string({ message: 'Please provide a password' }),
})