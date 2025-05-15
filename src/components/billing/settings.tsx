'use client'

import { addBillingAddress } from '@/app/actions/organization'
import { Address } from '@/generated/prisma'
import { capitalize, stringConcatenator, submitter } from '@/lib/utils'
import { addressForm, AddressFormProps } from '@/schema/organization'
import { zodResolver } from '@hookform/resolvers/zod'
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js'
import {
	CreditCard,
	Ellipsis,
	EllipsisVertical,
	MapPinPlus,
	Percent,
} from 'lucide-react'
import { ComponentProps, FormEvent, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import Stripe from 'stripe'
import { z } from 'zod'
import { SwitchButton } from '../switch-button'
import {
	AlertDialog,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from '../ui/alert-dialog'
import { Button } from '../ui/button'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '../ui/card'
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '../ui/dialog'
import { Form } from '../ui/form'
import {
	CityField,
	CountryField,
	StateField,
	StreetOneField,
	StreetTwoField,
	ZipCodeField,
} from './fields'

const planMethodSettingsForm = z.object({})

export function PlanSettingsForm({
	cardProps,
	plans,
}: {
	cardProps: ComponentProps<'div'>
	plans: Array<
		| {
				name: string
				default_price?: undefined
		  }
		| {
				name: string
				default_price: {
					unit_amount_decimal: string | null
					recurring: {
						interval: Stripe.Price.Recurring.Interval | undefined
					}
				}
		  }
	>
}) {
	const [isYearly, setIsYearly] = useState(false)
	// 1. Define your form.
	const form = useForm<z.infer<typeof planMethodSettingsForm>>({
		resolver: zodResolver(planMethodSettingsForm),
		defaultValues: {},
	})

	// 2. Define a submit handler.
	function onSubmit(values: z.infer<typeof planMethodSettingsForm>) {
		// placeholder
		console.log(values)
	}

	const filteredPlans = plans.filter(
		({ default_price }) =>
			default_price?.recurring?.interval === (isYearly ? 'year' : 'month'),
	)

	return (
		<Form {...form}>
			<Card {...cardProps} asChild>
				<form onSubmit={form.handleSubmit(onSubmit)}>
					<CardHeader className="flex items-center justify-between gap-8">
						<div className="grid gap-1.5">
							<CardTitle>Plan</CardTitle>
							<CardDescription>Upgrade or downgrade your plan</CardDescription>
						</div>
						<SwitchButton
							switched={isYearly}
							setSwitched={setIsYearly}
							labelOne="Monthly"
							labelTwo="Yearly"
						/>
					</CardHeader>
					<CardContent className="grid gap-4 md:gap-6">
						{filteredPlans.length > 0 ? (
							filteredPlans.map(({ name, default_price }) => (
								<div
									key={name}
									className="flex items-center justify-between gap-8"
								>
									<div className="flex items-center gap-4">
										<div className="flex flex-col">
											<span className="font-bold">{name}</span>
											{default_price && default_price.unit_amount_decimal ? (
												<small className="text-muted-foreground">
													${Number(default_price.unit_amount_decimal) / 100} /{' '}
													{default_price?.recurring.interval}
												</small>
											) : null}
										</div>
									</div>
									<Button>Select</Button>
								</div>
							))
						) : (
							<p>
								There are no plans on your Stripe. Please set some up to view
								them here.
							</p>
						)}
					</CardContent>
				</form>
			</Card>
		</Form>
	)
}

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
							<Button variant={'ghost'} size={'icon'}>
								<EllipsisVertical />
							</Button>
						</div>
					</div>
				))}
			</CardContent>
		</Card>
	)
}

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

export function BillingAddressSettingsForm({
	cardProps,
	billingAddresses,
}: {
	cardProps: ComponentProps<'div'>
	billingAddresses: Array<Address>
}) {
	return (
		<Card {...cardProps}>
			<CardHeader className="flex items-start justify-between gap-8">
				<div className="grid gap-1.5">
					<CardTitle>Billing Address</CardTitle>
					<CardDescription>
						Add a separate address to your invoices
					</CardDescription>
				</div>
				<div className="flex items-start gap-4">
					<AddBillingAddressForm />
				</div>
			</CardHeader>
			<CardContent className="grid gap-4 md:gap-6">
				{billingAddresses.map(
					({
						id,
						streetLineOne,
						streetLineTwo,
						cityName,
						zipCode,
						stateName,
					}) => (
						<div
							key={id}
							className="flex items-center justify-between gap-4 text-sm"
						>
							<div className="space-x-4">
								<span>
									{stringConcatenator(
										[streetLineOne, streetLineTwo, cityName, stateName],
										', ',
									)}{' '}
								</span>
								{zipCode}
							</div>
							<Button size={'icon'} variant={'ghost'}>
								<EllipsisVertical />
							</Button>
						</div>
					),
				)}
			</CardContent>
		</Card>
	)
}

function AddBillingAddressForm() {
	// 1. Define your form.
	const form = useForm<AddressFormProps>({
		resolver: zodResolver(addressForm),
	})

	// 2. Define a submit handler.
	const onSubmit = submitter(
		form,
		async (values: AddressFormProps) => {
			return await addBillingAddress(values)
		},
		{
			onSuccess: () => {
				toast.success('Successfully added a new billing address')
			},
		},
	)

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button size={'sm'}>
					Add <MapPinPlus />
				</Button>
			</DialogTrigger>
			<DialogContent>
				<Form {...form}>
					<form onSubmit={onSubmit}>
						<DialogHeader>
							<DialogTitle>Add a billing address</DialogTitle>
							<DialogDescription>
								Set up a new billing address for your organization
							</DialogDescription>
						</DialogHeader>
						<div className="space-y-4 py-6">
							<StreetOneField form={form} />
							<StreetTwoField form={form} />
							<div className="grid grid-cols-2 gap-x-2 gap-y-4">
								<CityField form={form} />
								<StateField form={form} />
								<ZipCodeField form={form} />
								<CountryField form={form} />
							</div>
						</div>
						<AlertDialogFooter>
							<DialogClose>Cancel</DialogClose>
							<Button>Add</Button>
						</AlertDialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	)
}

const discountSettingsForm = z.object({})

export function DiscountSettingsForm({
	cardProps,
}: {
	cardProps: ComponentProps<'div'>
}) {
	// 1. Define your form.
	const form = useForm<z.infer<typeof discountSettingsForm>>({
		resolver: zodResolver(discountSettingsForm),
		defaultValues: {},
	})

	// 2. Define a submit handler.
	function onSubmit(values: z.infer<typeof discountSettingsForm>) {
		// placeholder
		console.log(values)
	}

	return (
		<Form {...form}>
			<Card {...cardProps} asChild>
				<form onSubmit={form.handleSubmit(onSubmit)}>
					<CardHeader className="flex items-start justify-between gap-8">
						<div className="grid gap-1.5">
							<CardTitle>Discounts</CardTitle>
							<CardDescription>Add discounts to your plan</CardDescription>
						</div>
						<div className="flex items-start gap-4">
							<Button size={'sm'}>
								Add <Percent />
							</Button>
						</div>
					</CardHeader>
					<CardContent className="grid gap-4 md:gap-6"></CardContent>
				</form>
			</Card>
		</Form>
	)
}
