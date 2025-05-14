'use server'

import { emailSignUpSchema } from '@/schema/auth'
import { redirect } from 'next/navigation'
import { checkExistingUser } from '.'
import { handleOTPSetup } from './verify'
import prisma from '@/lib/prisma'
import { createSession } from '@/lib/session'
import { verifyCodeRoute } from '@/constants/routes'

const safeError = {
	errors: {
		root: {
			message: 'An error occurred while creating your account', // returning a vague error prevents enumeration attacks
		},
	},
}

export async function initializeEmailSignup({ email }: { email: string }) {
	// Step 1:
	// validate email sign up fields
	// the form is already validated once on the client but it's good
	// to validate twice to deter bad actors
	const validatedFields = emailSignUpSchema.safeParse({
		email,
	})

	// if any form fields are invalid, return early
	if (!validatedFields.success) {
		return {
			errors: validatedFields.error.flatten().fieldErrors,
		}
	}

	const { email: validatedEmail } = validatedFields.data

	// optional:
	// use an email verification api to check for bad emails before verifying
	// improves deliverability

	// Step 2:
	// check for an existing user with that email
	const existingUser: boolean = await checkExistingUser({
		email: validatedEmail,
	})

	if (existingUser) {
		// optional: log that an account already exists

		// todo: send an email to the user asking if they're trying to log in

		console.log('There is a user associated with that email')

		return safeError
	}

	// Step 3:
	// create and send the OTP to the email
	try {
		await handleOTPSetup({
			email: validatedEmail,
			type: 'email-signup',
			redirectTo: 'onboarding',
		})
	} catch (err) {
		console.error(err)

		return safeError
	}

	// Step 4:
	// redirect the user to the verification route
	// the user get's a link emailed as well
	redirect(verifyCodeRoute)
}

// triggers after user verifies email with OTP
export async function completeEmailSignup({ email }: { email: string }) {
	const user = await prisma.user.create({
		data: {
			email,
			onboarding: {
				create: {}, // this can be empty to use the defaults
			},
		},
		select: {
			id: true,
		},
	})

	return await createSession({ userId: user.id, context: 'email-signup' })
}