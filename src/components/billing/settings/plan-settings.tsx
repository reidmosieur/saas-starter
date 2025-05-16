'use client'

import { cancelSubscription, changeSubscription } from '@/app/actions/stripe'
import { capitalize, submitter } from '@/lib/utils'
import {
	cancelSubscriptionForm,
	CancelSubscriptionFormProps,
	modifySubscriptionForm,
	ModifySubscriptionFormProps,
} from '@/schema/organization'
import { zodResolver } from '@hookform/resolvers/zod'
import { ComponentProps, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { SwitchButton } from '../../switch-button'
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
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '../../ui/form'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '../../ui/select'
import { useBilling } from '../context'
import { PromoCodeField } from '../fields'

export function PlanSettingsForm({
	cardProps,
}: {
	cardProps: ComponentProps<'div'>
}) {
	const { currentPlan, plans } = useBilling()

	const [isYearly, setIsYearly] = useState(
		plans.find(({ default_price }) => currentPlan === default_price?.id)
			?.default_price?.recurring.interval === 'year',
	)

	const filteredPlans = plans.filter(
		({ default_price }) =>
			default_price?.recurring?.interval === (isYearly ? 'year' : 'month'),
	)

	return (
		<Card {...cardProps}>
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
						<div key={name} className="flex items-center justify-between gap-8">
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
							{default_price?.id !== currentPlan ? (
								<SelectNewPlan newPriceId={default_price?.id} />
							) : (
								<CancelPlan />
							)}
						</div>
					))
				) : (
					<p>
						There are no plans on your Stripe. Please set some up to view them
						here.
					</p>
				)}
			</CardContent>
		</Card>
	)
}

export function SelectNewPlan({ newPriceId }: { newPriceId?: string }) {
	const { subscriptionId, subscriptionItemId, cards } = useBilling()

	// 1. Define your form.
	const form = useForm<ModifySubscriptionFormProps>({
		resolver: zodResolver(modifySubscriptionForm),
		defaultValues: {
			subscriptionId,
			subscriptionItemId,
			priceId: newPriceId,
		},
	})

	// 2. Define a submit handler.
	const onSubmit = submitter(
		form,
		async (values: ModifySubscriptionFormProps) => {
			return await changeSubscription(values)
		},
		{
			onSuccess: () => {
				toast.success('Successfully added a new billing address')
			},
		},
	)

	const cardSelectOptions = cards.map(
		({ id, last4, exp_month, exp_year, brand }) => ({
			value: id,
			label: `${capitalize(brand)} **** ${last4} - Expires ${exp_month.toString().padStart(2, '0')}/${exp_year}`,
		}),
	)

	return (
		<AlertDialog>
			<AlertDialogTrigger asChild>
				<Button>Select</Button>
			</AlertDialogTrigger>
			<AlertDialogContent>
				<Form {...form}>
					<form onSubmit={onSubmit}>
						<AlertDialogHeader>
							<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
							<AlertDialogDescription>
								If you are selecting a plan with higher cost, this will add a
								prorated amount to your next invoice. If you are downgrading,
								you will lose access to higher tiers.
							</AlertDialogDescription>
						</AlertDialogHeader>
						<div className="space-y-4 py-6">
							<FormField
								control={form.control}
								name="paymentMethodId"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Card</FormLabel>
										<Select
											onValueChange={field.onChange}
											defaultValue={field.value}
										>
											<FormControl>
												<SelectTrigger className="w-full">
													<SelectValue placeholder="Select a payment method" />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												{cardSelectOptions.map(({ value, label }) => (
													<SelectItem key={value} value={value}>
														{label}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
										<FormMessage />
									</FormItem>
								)}
							/>
							<PromoCodeField form={form} />
						</div>
						<AlertDialogFooter>
							<AlertDialogCancel>Cancel</AlertDialogCancel>
							<Button>Continue</Button>
						</AlertDialogFooter>
					</form>
				</Form>
			</AlertDialogContent>
		</AlertDialog>
	)
}

export function CancelPlan() {
	const { subscriptionId } = useBilling()

	// 1. Define your form.
	const form = useForm<CancelSubscriptionFormProps>({
		resolver: zodResolver(cancelSubscriptionForm),
		defaultValues: {
			subscriptionId,
		},
	})

	// 2. Define a submit handler.
	const onSubmit = submitter(
		form,
		async (values: CancelSubscriptionFormProps) => {
			return await cancelSubscription(values)
		},
		{
			onSuccess: () => {
				toast.success('Successfully added a new billing address')
			},
		},
	)
	return (
		<AlertDialog>
			<AlertDialogTrigger asChild>
				<Button variant={'outline'}>Cancel</Button>
			</AlertDialogTrigger>
			<AlertDialogContent>
				<Form {...form}>
					<form onSubmit={onSubmit}>
						<AlertDialogHeader>
							<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
							<AlertDialogDescription>
								You will lose access to this application after your current
								period ends.
							</AlertDialogDescription>
						</AlertDialogHeader>
						<AlertDialogFooter>
							<AlertDialogCancel>No, keep my subscription</AlertDialogCancel>
							<Button>Yes, cancel my subscription</Button>
						</AlertDialogFooter>
					</form>
				</Form>
			</AlertDialogContent>
		</AlertDialog>
	)
}
