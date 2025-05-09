'use server'

import {
	avatarSettingsForm,
	emailSettingsForm,
	personalInfoSettingsForm,
	phoneNumberSettingsForm,
} from '@/schema/account'
import { getUserFromSession, getUserId } from '../user'
import { redirect } from 'next/navigation'
import prisma from '@/lib/prisma'
import { writeFile } from 'fs/promises'
import path from 'path'

const safeError = {
	errors: {
		root: {
			message: 'There was an error',
		},
	},
}

export async function updatePersonalInfoSettings(values: {
	firstName: string
	lastName: string
	username: string
}) {
	const userId = await getUserId()

	if (!userId) {
		redirect('/logout')
	}

	// Step 1:
	// validate email sign up fields
	// the form is already validated once on the client but it's good
	// to validate twice to deter bad actors
	const validatedFields = personalInfoSettingsForm.safeParse(values)

	// if any form fields are invalid, return early
	if (!validatedFields.success) {
		return {
			errors: validatedFields.error.flatten().fieldErrors,
		}
	}

	const { firstName, lastName, username } = validatedFields.data

	try {
		await prisma.user.update({
			where: {
				id: userId,
			},
			data: {
				firstName,
				lastName,
				username,
			},
		})

		return
	} catch (err) {
		console.error(err)

		return safeError
	}
}

export async function updateEmailSettings(values: { email: string }) {
	const userId = await getUserId()

	if (!userId) {
		redirect('/logout')
	}

	// Step 1:
	// validate email sign up fields
	// the form is already validated once on the client but it's good
	// to validate twice to deter bad actors
	const validatedFields = emailSettingsForm.safeParse(values)

	// if any form fields are invalid, return early
	if (!validatedFields.success) {
		return {
			errors: validatedFields.error.flatten().fieldErrors,
		}
	}

	const { email } = validatedFields.data

	try {
		await prisma.user.update({
			where: {
				id: userId,
			},
			data: {
				email,
			},
		})

		return
	} catch (err) {
		console.error(err)

		return safeError
	}
}

export async function updatePhoneNumberSettings(values: {
	countryCode: string
	phoneNumber: string
}) {
	const userId = await getUserId()

	if (!userId) {
		redirect('/logout')
	}

	// Step 1:
	// validate email sign up fields
	// the form is already validated once on the client but it's good
	// to validate twice to deter bad actors
	const validatedFields = phoneNumberSettingsForm.safeParse(values)

	// if any form fields are invalid, return early
	if (!validatedFields.success) {
		return {
			errors: validatedFields.error.flatten().fieldErrors,
		}
	}

	const { countryCode, phoneNumber: number } = validatedFields.data

	try {
		await prisma.user.update({
			where: {
				id: userId,
			},
			data: {
				phoneNumber: {
					upsert: {
						create: {
							countryCode,
							number,
						},
						update: {
							countryCode,
							number,
						},
					},
				},
			},
		})

		return
	} catch (err) {
		console.error(err)

		return safeError
	}
}

export async function uploadAvatar(formData: FormData) {
	const user = await getUserFromSession({ username: true, id: true })

	if (!user) {
		redirect('/logout')
	}

	const file = formData.get('avatar')
	if (!(file instanceof File)) {
		return {
			errors: {
				avatar: {
					message: 'New avatar file missing',
				},
			},
		}
	}
	const height = formData.get('height')
	const width = formData.get('width')

	// Validate with Zod
	const validatedFields = avatarSettingsForm.safeParse({
		avatar: file,
		height,
		width,
	})
	if (!validatedFields.success) {
		return {
			errors: validatedFields.error.flatten().fieldErrors,
		}
	}

	const {
		avatar,
		height: validatedHeight,
		width: validatedWidth,
	} = validatedFields.data

	const buffer = Buffer.from(await avatar.arrayBuffer())
	// write file name with .local. to prevent committing
	const filename =
		process.env.NODE_ENV === 'development'
			? `${user.username}.local.png`
			: `${user.username}.png`
	const filePath = path.join(process.cwd(), 'public/user-images', filename)
	try {
		await writeFile(filePath, buffer)
	} catch (err) {
		console.error(err)

		return safeError
	}

	try {
		await prisma.user.update({
			where: {
				id: user.id,
			},
			data: {
				avatar: {
					upsert: {
						create: {
							src: `/user-images/${filename}`,
							alt: 'Your avatar',
							height: Number(validatedHeight),
							width: Number(validatedWidth),
						},
						update: {
							src: `/user-images/${filename}`,
							alt: 'Your avatar',
							height: Number(validatedHeight),
							width: Number(validatedWidth),
						},
					},
				},
			},
		})
	} catch (err) {
		console.error(err)

		return safeError
	}

	return
}