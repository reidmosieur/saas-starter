'use client'

import { completePersonalInfoOnboarding } from '@/app/actions/account/onboarding'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { personalInfoOnboardingStepSchema } from '@/schema/account'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { NameField, PhoneNumberField } from '../fields'

export function PersonalInfoOnboardingStep() {
	// 1. Define your form.
	const form = useForm<z.infer<typeof personalInfoOnboardingStepSchema>>({
		resolver: zodResolver(personalInfoOnboardingStepSchema),
		defaultValues: {
			firstName: '',
			lastName: '',
			countryCode: '',
			phoneNumber: '',
		},
	})

	// 2. Define a submit handler.
	async function onSubmit(
		values: z.infer<typeof personalInfoOnboardingStepSchema>,
	) {
		// Do something with the form values.
		// ✅ This will be type-safe and validated.
		await completePersonalInfoOnboarding(values)
	}
	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)}>
				<div className="grid gap-6">
					<div className="grid gap-6">
						<NameField form={form} firstNameInputProps={{ autoFocus: true }} />
						<PhoneNumberField form={form} />
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
