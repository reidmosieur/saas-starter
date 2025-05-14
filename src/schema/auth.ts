import { z } from 'zod'

export const passwordSchema = z
	.string({ message: 'Please provide a password' })
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
	.trim()

export const emailSchema = z
	.string()
	.email({ message: 'Please provide a valid email' })
	.trim()

export const emailSignUpSchema = z.object({
	email: emailSchema,
})
export type EmailSignUpFormProps = z.infer<typeof emailSignUpSchema>

export const emailLoginSchema = z.object({
	email: emailSchema,
	password: z
		.string({ message: 'Please provide a password' })
		// on the client, the field is initialized as an empty string to
		// prevent controlled input errors so this is essentially a "required" fix
		.min(1, 'Please provide a password')
		.trim(),
})
export type EmailLoginFormProps = z.infer<typeof emailLoginSchema>

export const forgotPasswordSchema = z.object({
	email: emailSchema,
})
export type ForgotPasswordFormProps = z.infer<typeof forgotPasswordSchema>

export const resetPasswordSchema = z.object({
	password: passwordSchema,
	verifyPassword: passwordSchema,
})
export type ResetPasswordFormProps = z.infer<typeof resetPasswordSchema>

export const verifyEmailSchema = z.object({
	code: z.string().min(6, 'Your one-time password must be 6 characters'),
})
export type VerifyEmailFormProps = z.infer<typeof verifyEmailSchema>

export const manageSessionSchema = z.object({
	ids: z.array(z.number()),
})
export type ManageSessionFormProps = z.infer<typeof manageSessionSchema>