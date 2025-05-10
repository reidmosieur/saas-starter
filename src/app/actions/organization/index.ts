'use server'

import {
	organizationInfoSettingsForm,
	OrganizationInfoSettingsFormProps,
} from '@/schema/organization'
import { getUserFromSession } from '../user'
import prisma from '@/lib/prisma'

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
