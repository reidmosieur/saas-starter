'use server'

import { hashSalt } from '@/constants/auth'
import prisma from '@/lib/prisma'
import bcrypt from 'bcrypt'

export async function checkExistingUser({
	id,
	email,
	username,
}: {
	id?: number
	email?: string
	username?: string
}) {
	// @ts-expect-error: TS complains because it isn't aware of the extension
	return await prisma.user.exists({
		OR: [
			{
				id,
			},
			{
				email,
			},
			{
				username,
			},
		],
	})
}

export async function hashPassword(passwordString: string) {
	return await bcrypt.hash(passwordString, hashSalt)
}
