'use client'

import { Button } from '@/components/ui/button'
import { Form, FormMessage } from '@/components/ui/form'
import { submitter } from '@/lib/utils'
import {
	UsernameOnboardingStepFormProps,
	usernameOnboardingStepSchema,
} from '@/schema/account'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { UsernameField } from '../fields'
import { completeUsernameOnboarding } from '@/app/actions/account/onboarding'

export function UsernameOnboardingStep() {
	// 1. Define your form.
	const form = useForm<UsernameOnboardingStepFormProps>({
		resolver: zodResolver(usernameOnboardingStepSchema),
		defaultValues: {
			username: '',
		},
	})

	// 2. Define a submit handler.
	const onSubmit = submitter(
		form,
		async (values: UsernameOnboardingStepFormProps) => {
			return await completeUsernameOnboarding(values)
		},
	)
	return (
		<Form {...form}>
			<form onSubmit={onSubmit}>
				<div className="grid gap-6">
					<div className="grid gap-6">
						<UsernameField form={form} inputProps={{ autoFocus: true }} />
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
