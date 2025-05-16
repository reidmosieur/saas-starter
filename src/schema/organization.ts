import { permissionsArray } from '@/constants/permissions'
import { z } from 'zod'
import { emailSchema } from './auth'
import {
	firstNameSchema,
	lastNameSchema,
	organizationNameSchema,
} from './shared'

export const streetOneSchema = z.string()
export const streetTwoSchema = z.string().optional()
export const citySchema = z.string()
export const stateSchema = z.string()
export const zipCodeSchema = z.string()
export const countrySchema = z.string()

// for use with a select
export const roleSchema = z.string()

// for use with an input to create a role
export const roleNameSchema = z
	.string()
	.min(2, 'Please provide a name for the role')

export const permissionSchema = z.object({
	key: z.string(),
	action: z.string(),
	access: z.string(),
	entity: z.string(),
})
export const selectedPermissionSchema = z.enum(
	permissionsArray.map(({ key }) => key) as [string, ...string[]],
)
export const permissionsSchema = z.array(selectedPermissionSchema)

export const addressForm = z.object({
	streetOne: streetOneSchema,
	streetTwo: streetTwoSchema,
	city: citySchema,
	state: stateSchema,
	zipCode: zipCodeSchema,
	country: countrySchema,
})
export type AddressFormProps = z.infer<typeof addressForm>

export const organizationInfoSettingsForm = z.object({
	name: organizationNameSchema,
})
export type OrganizationInfoSettingsFormProps = z.infer<
	typeof organizationInfoSettingsForm
>

export const newRoleForm = z.object({
	name: roleNameSchema,
	permissions: permissionsSchema,
})
export type NewRoleFormProps = z.infer<typeof newRoleForm>

export const updateRoleForm = z.object({
	id: z.number(),
	name: roleNameSchema,
	permissions: permissionsSchema,
})
export type UpdateRoleFormProps = z.infer<typeof updateRoleForm>

export const inviteUserForm = z.object({
	email: emailSchema,
	firstName: firstNameSchema,
	lastName: lastNameSchema,
	role: roleSchema,
})
export type InviteUserFormProps = z.infer<typeof inviteUserForm>

export const suspendUserForm = z
	.object({
		email: emailSchema,
		confirmEmail: emailSchema,
	})
	.refine((data) => data.email === data.confirmEmail, {
		message: 'That email does not match',
		path: ['email'],
	})
export type SuspendUserFormProps = z.infer<typeof suspendUserForm>

export const reactivateUserForm = z.object({
	id: z.number(),
})
export type ReactivateUserFormProps = z.infer<typeof reactivateUserForm>

export const updateOrganizationUserForm = z.object({
	id: z.number(),
	firstName: firstNameSchema,
	lastName: lastNameSchema,
	role: roleSchema,
})
export type UpdateOrganizationUserForm = z.infer<
	typeof updateOrganizationUserForm
>

export const modifySubscriptionForm = z.object({
	subscriptionId: z.string(),
	subscriptionItemId: z.string(),
	priceId: z.string().optional(),
	paymentMethodId: z.string().optional(),
	promoCode: z.string().optional(),
})
export type ModifySubscriptionFormProps = z.infer<typeof modifySubscriptionForm>

export const cancelSubscriptionForm = z.object({
	subscriptionId: z.string(),
})
export type CancelSubscriptionFormProps = z.infer<typeof cancelSubscriptionForm>

export const billingOnboardingSchema = z.object({
	hasCard: z.boolean().optional(),
	streetOne: streetOneSchema,
	streetTwo: streetTwoSchema,
	city: citySchema,
	state: stateSchema,
	zipCode: zipCodeSchema,
	country: countrySchema,
})
export type BillingOnboardingFormProps = z.infer<typeof billingOnboardingSchema>