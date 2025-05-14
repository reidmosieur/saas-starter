'use server'

import { updateOwnUser } from '@/constants/permissions'
import { logoutRoute } from '@/constants/routes'
import { checkUserPermissions } from '@/lib/access-control'
import { revokeSession } from '@/lib/session'
import { constructRequiredPermissions } from '@/lib/utils'
import { ManageSessionFormProps, manageSessionSchema } from '@/schema/auth'
import { redirect } from 'next/navigation'

const safeError = {
	errors: {
		root: {
			message: 'Something went wrong',
		},
	},
}

export async function revokeUserSessions(values: ManageSessionFormProps) {
	const { permitted, user } = await checkUserPermissions({
		requiredPermissions: constructRequiredPermissions([updateOwnUser]),
	})

	if (!user) {
		redirect('/logout')
	}

	if (!permitted) {
		return safeError
	}

	// Step 1:
	// validate email sign up fields
	// the form is already validated once on the client but it's good
	// to validate twice to deter bad actors
	const validatedFields = manageSessionSchema.safeParse(values)

	// if any form fields are invalid, return early
	if (!validatedFields.success) {
		return {
			errors: validatedFields.error.flatten().fieldErrors,
		}
	}

	const { ids } = validatedFields.data
	const revokeSessionPromises = ids.map(async (id) => await revokeSession(id))

	let results
	try {
		results = await Promise.all(revokeSessionPromises)
	} catch (err) {
		console.error(err)

		return safeError
	}

	if (results.some((result) => result?.logout)) {
		redirect(logoutRoute)
	}
}
