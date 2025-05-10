import { z } from 'zod'
import { emailSchema, passwordSchema } from './auth'
import { organizationNameSchema } from './organization'

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
export const countryCodeSchema = z.string()
export const phoneNumberSchema = z.string()

const fileSizeLimit = 5 * 1024 * 1024 // 5MB
export const avatarSchema = z
	.instanceof(File)
	.refine((file) => ['image/png'].includes(file.type), 'File must be a PNG')
	.refine((file) => file.size <= fileSizeLimit, {
		message: 'File size should not exceed 5MB',
	})

export const credentialsOnboardingStepSchema = z.object({
	username: usernameSchema,
	password: passwordSchema,
})
export type CredentialsOnboardingStepFormProps = z.infer<
	typeof credentialsOnboardingStepSchema
>

export const personalInfoOnboardingStepSchema = z.object({
	firstName: firstNameSchema,
	lastName: lastNameSchema,
	countryCode: countryCodeSchema.optional(),
	phoneNumber: phoneNumberSchema.optional(),
})
export type PersonalInfoOnboardingStepSchema = z.infer<
	typeof personalInfoOnboardingStepSchema
>

export const organizationOnboardingStepSchema = z.object({
	name: organizationNameSchema,
})
export type OrganizationOnboardingStepFormProps = z.infer<
	typeof organizationOnboardingStepSchema
>

export const personalInfoSettingsForm = z.object({
	username: usernameSchema,
	firstName: firstNameSchema,
	lastName: lastNameSchema,
})
export type PersonalInfoSettingsFormProps = z.infer<
	typeof personalInfoSettingsForm
>

export const emailSettingsForm = z.object({
	email: emailSchema,
})
export type EmailSettingsFormProps = z.infer<typeof emailSettingsForm>

export const phoneNumberSettingsForm = z.object({
	countryCode: countryCodeSchema,
	phoneNumber: phoneNumberSchema,
})
export type PhoneNumberSettingsFormProps = z.infer<
	typeof phoneNumberSettingsForm
>

export const avatarSettingsForm = z.object({
	avatar: avatarSchema,
	height: z.string(),
	width: z.string(),
})
export type AvatarSettingsFormProps = z.infer<typeof avatarSettingsForm>