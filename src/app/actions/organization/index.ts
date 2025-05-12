'use server'

import {
	inviteUserForm,
	InviteUserFormProps,
	newRoleForm,
	NewRoleFormProps,
	organizationInfoSettingsForm,
	OrganizationInfoSettingsFormProps,
} from '@/schema/organization'
import { getUserFromSession } from '../user'
import prisma from '@/lib/prisma'
import { checkUserPermissions } from '@/lib/access-control'
import { constructRequiredPermissions } from '@/lib/utils'
import {
	createOrganizationRole as createOrganizationRolePermission,
	createOrganizationUser,
} from '@/constants/permissions'
import { redirect } from 'next/navigation'
import { handleOTPSetup } from '../auth/verify'
import { checkExistingUser } from '../auth'
import { createSession } from '@/lib/session'

const safeError = {
	errors: {
		root: {
			message: 'Something went wrong',
		},
	},
}

export async function updateOrganizationInfoSettingsForm(
	values: OrganizationInfoSettingsFormProps,
) {
	const user = await getUserFromSession({
		id: true,
		organization: { select: { id: true } },
	})

	// Step 1:
	// validate email sign up fields
	// the form is already validated once on the client but it's good
	// to validate twice to deter bad actors
	const validatedFields = organizationInfoSettingsForm.safeParse(values)

	// if any form fields are invalid, return early
	if (!validatedFields.success) {
		return {
			errors: validatedFields.error.flatten().fieldErrors,
		}
	}

	const { name } = validatedFields.data

	try {
		await prisma.organization.update({
			where: {
				id: user?.organization?.id,
			},
			data: {
				name,
			},
		})
	} catch (err) {
		console.error(err)

		return safeError
	}

	return
}

export async function createOrganizationRole(values: NewRoleFormProps) {
	const { permitted, user } = await checkUserPermissions({
		additionalSelect: {
			id: true,
			organization: { select: { id: true } },
		},
		requiredPermissions: constructRequiredPermissions([
			createOrganizationRolePermission,
		]),
	})

	if (!user) {
		redirect('/logout')
	}

	const organizationId = user.organization?.id

	if (!permitted || !organizationId) {
		return safeError
	}

	// Step 1:
	// validate email sign up fields
	// the form is already validated once on the client but it's good
	// to validate twice to deter bad actors
	const validatedFields = newRoleForm.safeParse(values)

	// if any form fields are invalid, return early
	if (!validatedFields.success) {
		return {
			errors: validatedFields.error.flatten().fieldErrors,
		}
	}

	const { name, permissions } = validatedFields.data

	try {
		await prisma.role.create({
			data: {
				name,
				organizationId,
				permissions: {
					connect: [
						...permissions.map((key) => ({ key })),
						{ key: 'read:granted:dashboard' },
					],
				},
			},
		})
	} catch (err) {
		console.error(err)

		return safeError
	}

	return
}

export async function sendOrganizationInvitation(values: InviteUserFormProps) {
	const { permitted, user } = await checkUserPermissions({
		additionalSelect: {
			id: true,
			organization: { select: { id: true } },
		},
		requiredPermissions: constructRequiredPermissions([createOrganizationUser]),
	})

	if (!user) {
		redirect('/logout')
	}

	const organizationId = user.organization?.id

	if (!permitted || !organizationId) {
		return safeError
	}

	// Step 1:
	// validate email sign up fields
	// the form is already validated once on the client but it's good
	// to validate twice to deter bad actors
	const validatedFields = inviteUserForm.safeParse(values)

	// if any form fields are invalid, return early
	if (!validatedFields.success) {
		return {
			errors: validatedFields.error.flatten().fieldErrors,
		}
	}

	const { email, firstName, lastName, role } = validatedFields.data

	const existingUser = await checkExistingUser({ email })

	if (existingUser) {
		return {
			errors: {
				email: {
					message: 'A user already exists with that email',
				},
			},
		}
	}

	try {
		await prisma.user.create({
			data: {
				email,
				firstName,
				lastName,
				organizationId,
				roles: {
					connect: { id: Number(role) },
				},
				invitedAt: new Date(),
			},
		})
	} catch (err) {
		console.error(err)

		return safeError
	}

	try {
		await handleOTPSetup({
			email,
			type: 'organization-invite',
			redirectTo: 'onboarding',
		})
	} catch (err) {
		console.error(err)

		return safeError
	}

	return
}

// triggers after user verifies email with OTP
export async function completeOrganizationInvitation({
	email,
}: {
	email: string
}) {
	try {
		const user = await prisma.user.update({
			where: {
				email,
			},
			data: {
				email,
				emailVerified: new Date(),
				onboarding: {
					create: {
						completedSteps: [],
						requiredSteps: ['CREDENTIALS', 'PERSONAL_INFO'], // organization has already been created
					},
				},
			},
			select: {
				id: true,
			},
		})

		await createSession({
			userId: user.id,
			context: 'organization-signup',
		})

		return
	} catch (err) {
		console.error(err)

		return safeError
	}
}