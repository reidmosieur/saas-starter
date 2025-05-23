'use client'

import { completePersonalInfoOnboarding } from '@/app/actions/account/onboarding'
import { Button } from '@/components/ui/button'
import { Form, FormMessage } from '@/components/ui/form'
import { personalInfoOnboardingStepSchema } from '@/schema/account'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { NameField, PhoneNumberFlagField } from '../fields'

export function PersonalInfoOnboardingStep() {
	// 1. Define your form.
	const form = useForm<z.infer<typeof personalInfoOnboardingStepSchema>>({
		resolver: zodResolver(personalInfoOnboardingStepSchema),
		defaultValues: {
			firstName: '',
			lastName: '',
		},
	})

	// 2. Define a submit handler.
	async function onSubmit(
		values: z.infer<typeof personalInfoOnboardingStepSchema>,
	) {
		// Do something with the form values.
		// ✅ This will be type-safe and validated.
		const result = await completePersonalInfoOnboarding(values)
		if (result && result.errors) {
			Object.entries(result.errors).map(([key, value]) =>
				form.setError(
					key as
						| 'firstName'
						| 'lastName'
						| 'countryCode'
						| 'phoneNumber'
						| 'root',
					value,
				),
			)
		}
	}
	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)}>
				<div className="grid gap-6">
					<div className="grid gap-6">
						<NameField form={form} firstNameInputProps={{ autoFocus: true }} />
						<PhoneNumberFlagField form={form} />
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
