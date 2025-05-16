'use client'

import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog'
import { capitalize } from '@/lib/utils'
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js'
import { CreditCard, Ellipsis, Pencil } from 'lucide-react'
import { ComponentProps, FormEvent, useState } from 'react'
import { toast } from 'sonner'
import {
	AlertDialog,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from '../../ui/alert-dialog'
import { Button } from '../../ui/button'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '../../ui/card'
import { hideStripeDependents } from '@/components/stripe-elements-provider'
import { StripeMissing } from '@/components/stripe-missing'

export function PaymentMethodSettingsForm({
	cardProps,
	clientSecret,
	cards,
}: {
	cardProps: ComponentProps<'div'>
	clientSecret: string | null
	cards: Array<{
		id: string
		brand: string
		exp_month: number
		exp_year: number
		last4: string
	}>
}) {
	return (
		<Card {...cardProps}>
			<CardHeader className="flex items-start justify-between gap-8">
				<div className="grid gap-1.5">
					<CardTitle>Payment Methods</CardTitle>
					<CardDescription>Add payment methods for your plan</CardDescription>
				</div>
				<div className="flex items-start gap-4">
					{hideStripeDependents ? (
						<StripeMissing />
					) : (
						<AlertDialog>
							<AlertDialogTrigger asChild>
								<Button size={'sm'}>
									Add <CreditCard />
								</Button>
							</AlertDialogTrigger>
							<AlertDialogContent>
								<AddCardForm clientSecret={clientSecret} />
							</AlertDialogContent>
						</AlertDialog>
					)}
				</div>
			</CardHeader>
			<CardContent className="grid gap-4 md:gap-6">
				{cards.map(({ brand, exp_month, exp_year, last4 }, index) => (
					<div
						key={`${last4}-${index}`}
						className="flex items-center justify-between gap-8 text-sm"
					>
						<div className="flex items-center gap-4">
							<div className="inline-flex items-center gap-2">
								{capitalize(brand)} <Ellipsis /> {last4}
							</div>
						</div>
						<div className="flex items-center gap-4">
							Valid until {exp_month}/{exp_year}
						</div>
					</div>
				))}
			</CardContent>
		</Card>
	)
}

// todo: convert this form to use react-hook-form
function AddCardForm({ clientSecret }: { clientSecret: string | null }) {
	const [stripeError, setStripeError] = useState<undefined | string>(undefined)
	const [submittingCard, setSubmittingCard] = useState(false)

	const stripe = useStripe()
	const elements = useElements()

	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault()

		// prevent multiple submits
		if (submittingCard) {
			return null
		}

		setSubmittingCard(true)

		if (!stripe || !elements || !clientSecret) {
			toast.warning(`The connection to Stripe isn't ready yet`)

			console.log(stripe, elements, clientSecret)

			return
		}

		const cardElement = elements.getElement(CardElement)

		if (!cardElement) {
			toast.warning(`The card element is missing`)

			console.log(cardElement)

			return
		}

		const { error } = await stripe.confirmCardSetup(clientSecret, {
			payment_method: {
				card: cardElement,
			},
		})

		if (error) {
			toast.error('Something went wrong adding your card')

			setStripeError(error.message)
		} else {
			toast.success('Your card was added')
		}

		setSubmittingCard(false)
	}

	return (
		<form onSubmit={handleSubmit}>
			<AlertDialogHeader>
				<AlertDialogTitle>Add a payment method</AlertDialogTitle>
				<AlertDialogDescription>
					Set up a new payment method for your organization
				</AlertDialogDescription>
			</AlertDialogHeader>
			<div className="py-6">
				<CardElement className="border-input text-foreground h-9 rounded-md border bg-white px-2 py-2" />
				{stripeError ? (
					<small className="text-destructive">{stripeError}</small>
				) : null}
			</div>
			<AlertDialogFooter>
				<AlertDialogCancel disabled={submittingCard}>Cancel</AlertDialogCancel>
				<Button disabled={!stripe} loading={submittingCard}>
					Continue
				</Button>
			</AlertDialogFooter>
		</form>
	)
}

function RemoveCard() {
	return (
		<Dialog>
			<DialogTrigger asChild>
				<button className="hover:bg-accent flex w-full items-center justify-start gap-2 rounded-md px-3.5 py-2 text-sm">
					<Pencil className="size-4" />
					Edit
				</button>
			</DialogTrigger>
			<DialogContent className="w-fit max-w-none sm:max-w-none">
				{/* <Form {...form}>
					<form onSubmit={onSubmit}> */}
				<DialogHeader>
					<DialogTitle>Are you sure?</DialogTitle>
					<DialogDescription>
						If you remove the card now, you will not be able to use it again in
						the future.
					</DialogDescription>
				</DialogHeader>
				<DialogFooter>
					<DialogClose asChild>
						<Button variant={'outline'}>Cancel</Button>
					</DialogClose>
					<Button>Yes, remove card</Button>
				</DialogFooter>
				{/* </form>
				</Form> */}
			</DialogContent>
		</Dialog>
	)
}
