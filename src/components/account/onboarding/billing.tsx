'use client'

import { completeBillingOnboarding } from '@/app/actions/account/onboarding'
import { AddressFields } from '@/components/billing/fields'
import { Button } from '@/components/ui/button'
import { Form, FormMessage } from '@/components/ui/form'
import { Label } from '@/components/ui/label'
import {
	BillingOnboardingFormProps,
	billingOnboardingSchema,
} from '@/schema/organization'
import { zodResolver } from '@hookform/resolvers/zod'
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

export function BillingOnboardingStep() {
	const stripe = useStripe()
	const elements = useElements()
	const clientSecret = ''

	// 1. Define your form.
	const form = useForm<BillingOnboardingFormProps>({
		resolver: zodResolver(billingOnboardingSchema),
		defaultValues: {
			hasCard: false,
		},
	})

	// 2. Define a submit handler.
	async function onSubmit(values: BillingOnboardingFormProps) {
		if (process.env.NODE_ENV === 'production') {
			if (!stripe || !elements || !clientSecret) {
				toast.warning(`The connection to Stripe isn't ready yet`)

				form.setError('root', {
					message: 'Something went wrong',
				})

				return
			}

			const cardElement = elements.getElement(CardElement)

			if (!cardElement) {
				toast.warning(`The card element is missing`)

				form.setError('root', {
					message: 'Something went wrong',
				})

				return
			}

			const { error } = await stripe.confirmCardSetup(clientSecret, {
				payment_method: {
					card: cardElement,
				},
			})

			if (error) {
				toast.error('Something went wrong adding your card')

				form.setError('root', { message: error })
			} else {
				toast.success('Your card was added')
			}
		}

		const result = await completeBillingOnboarding(values)
		if (result && result.errors) {
			Object.entries(result.errors).map(([key, value]) =>
				form.setError(
					key as
						| 'hasCard'
						| 'streetOne'
						| 'streetTwo'
						| 'city'
						| 'state'
						| 'zipCode'
						| 'country'
						| 'root',
					value,
				),
			)
		}
	}

	const cardError = form.formState.errors.hasCard?.message

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)}>
				<div className="grid gap-6">
					<div className="grid gap-6">
						<div className="grid gap-1.5">
							<Label>Card</Label>
							<CardElement className="border-input text-foreground h-9 rounded-md border bg-white px-2 py-2" />
							{cardError ? (
								<small className="text-destructive">{cardError}</small>
							) : null}
						</div>
						<div className="space-y-6">
							<legend>Billing Address</legend>
							<AddressFields form={form} />
						</div>
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
