'use client'

import { completeCredentialsOnboarding } from '@/app/actions/account/onboarding'
import { PasswordField } from '@/components/auth/fields'
import { Button } from '@/components/ui/button'
import { Form, FormMessage } from '@/components/ui/form'
import { credentialsOnboardingStepSchema } from '@/schema/account'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { UsernameField } from '../fields'

export function CredentialsOnboardingStep() {
	// 1. Define your form.
	const form = useForm<z.infer<typeof credentialsOnboardingStepSchema>>({
		resolver: zodResolver(credentialsOnboardingStepSchema),
		defaultValues: {
			username: '',
			password: '',
		},
	})

	// 2. Define a submit handler.
	async function onSubmit(
		values: z.infer<typeof credentialsOnboardingStepSchema>,
	) {
		// Do something with the form values.
		// ✅ This will be type-safe and validated.
		const result = await completeCredentialsOnboarding(values)
		if (result && result.errors) {
			Object.entries(result.errors).map(([key, value]) =>
				form.setError(key as 'username' | 'password' | 'root', value),
			)
		}
	}
	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)}>
				<div className="grid gap-6">
					<div className="grid gap-6">
						<UsernameField form={form} inputProps={{ autoFocus: true }} />
						<PasswordField form={form} />
						{form.formState.errors.root ? (
							<FormMessage>{form.formState.errors.root.message}</FormMessage>
						) : null}
						<Button
							type="submit"
							className="w-full"
							loading={form.formState.isSubmitting}
						>
							Continue
						</Button>
					</div>
				</div>
			</form>
		</Form>
	)
}
