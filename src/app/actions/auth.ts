import { emailSignUpSchema } from '@/schema/auth'

export async function emailSignup({
	email,
	password,
}: {
	email: string
	password: string
}) {
	// validate email sign up fields
	// the form is already validated once on the client but it's good
	// to validate twice to deter bad actors
	const validatedFields = emailSignUpSchema.safeParse({
		email,
		password,
	})

	// if any form fields are invalid, return early
	if (!validatedFields.success) {
		return {
			errors: validatedFields.error.flatten().fieldErrors,
		}
	}

	// todo: implement email verification
}
