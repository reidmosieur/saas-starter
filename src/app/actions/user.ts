import prisma from '@/lib/prisma'
import { readSession } from '@/lib/session'
import { redirect } from 'next/navigation'
import { cache } from 'react'
import 'server-only'

export const getUserFromSession = cache(async () => {
	const session = await readSession()
	const id = session?.userId

	if (!id) return null

	const user = await prisma.user.findUnique({
		where: {
			id,
		},
		select: {
			firstName: true,
			lastName: true,
			email: true,
			onboarded: true,
		},
	})

	return user
})

export async function handleUserInitialization() {
	// Step 1:
	// get the user
	const user = await getUserFromSession()

	// Step 2:
	// the user should exist. they have a session cookie in middleware.
	// so we log them out if they don't
	if (!user) {
		redirect('/logout')
	}

	// Step 3:
	// check if the user is fully onboarded. redirect them if they aren't
	// user.onboarded is a date so we convert it to boolean
	if (!Boolean(user.onboarded)) {
		redirect('/onboarding')
	}

	return user
}
