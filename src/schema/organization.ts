import { permissionsArray } from '@/constants/permissions'
import { z } from 'zod'
import { emailSchema } from './auth'
import {
	firstNameSchema,
	lastNameSchema,
	organizationNameSchema,
} from './shared'

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

export const inviteUserForm = z.object({
	email: emailSchema,
	firstName: firstNameSchema,
	lastName: lastNameSchema,
	role: roleSchema,
})
export type InviteUserFormProps = z.infer<typeof inviteUserForm>
