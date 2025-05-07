'use client'

import { completeOrganizationOnboarding } from '@/app/actions/account/onboarding'
import { OrganizationNameField } from '@/components/organization/fields'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { organizationOnboardingStepSchema } from '@/schema/account'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

export function OrganizationOnboardingStep() {
	// 1. Define your form.
	const form = useForm<z.infer<typeof organizationOnboardingStepSchema>>({
		resolver: zodResolver(organizationOnboardingStepSchema),
		defaultValues: {
			name: '',
		},
	})

	// 2. Define a submit handler.
	async function onSubmit(
		values: z.infer<typeof organizationOnboardingStepSchema>,
	) {
		// Do something with the form values.
		// ✅ This will be type-safe and validated.
		await completeOrganizationOnboarding(values)
	}
	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)}>
				<div className="grid gap-6">
					<div className="grid gap-6">
						<OrganizationNameField
							form={form}
							inputProps={{ autoFocus: true }}
						/>
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
