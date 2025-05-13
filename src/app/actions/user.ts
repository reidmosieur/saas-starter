import { readGrantedDashboard } from '@/constants/permissions'
import { defaultUserSelect } from '@/constants/user'
import { Prisma } from '@/generated/prisma'
import { checkUserPermissions } from '@/lib/access-control'
import prisma from '@/lib/prisma'
import { readSession } from '@/lib/session'
import { constructRequiredPermissions } from '@/lib/utils'
import { redirect } from 'next/navigation'
import { cache } from 'react'
import 'server-only'

export const getUserId = cache(async () => {
	const session = await readSession()
	return session?.userId
})

export const getUserFromSession = cache(
	async (
		select: Prisma.UserSelect = defaultUserSelect,
	): Promise<Prisma.UserGetPayload<{ select: typeof select }> | null> => {
		const id = await getUserId()

		if (!id) return null

		const user = await prisma.user.findUnique({
			where: {
				id,
			},
			select,
		})

		return user
	},
)

export async function handleUserInitialization() {
	// Step 1:
	// get the user
	const { permitted, user } = await checkUserPermissions({
		requiredPermissions: constructRequiredPermissions([readGrantedDashboard]),
		additionalSelect: defaultUserSelect,
	})

	// Step 2:
	// the user should exist. they have a session cookie in middleware.
	// so we log them out if they don't
	if (!user) {
		redirect('/logout')
	}

	// Step 3:
	// check if the user is permitted by checking "read-dashboard-granted"
	// this is simpler than checking the "suspended" property since it's the
	// same as checking if a user is accessing a route they don't have access to
	if (!permitted) {
		redirect('/logout')
	}

	return user
}
