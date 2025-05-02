'use client'

import { CardFormProps } from '@/types'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Button } from '../ui/button'
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '../ui/card'
import { Form } from '../ui/form'
import { User } from 'lucide-react'

const planMethodSettingsForm = z.object({})

export function PlanSettingsForm({ cardProps }: CardFormProps) {
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

	return (
		<Form {...form}>
			<Card {...cardProps} asChild>
				<form onSubmit={form.handleSubmit(onSubmit)}>
					<CardHeader>
						<CardTitle>Plan</CardTitle>
						<CardDescription>Upgrade or downgrade your plan</CardDescription>
					</CardHeader>
					<CardContent className="grid gap-4 md:gap-6">
						<div className="flex items-center justify-between gap-8">
							<div className="flex items-center gap-4">
								<User />
								<div className="flex flex-col">
									<span className="font-bold">Starter</span>
									<small className="text-muted-foreground">$10 / month</small>
								</div>
							</div>
							<Button>Select</Button>
						</div>
						<div className="flex items-center justify-between gap-8">
							<div className="flex items-center gap-4">
								<User />
								<div className="flex flex-col">
									<span className="font-bold">Agency</span>
									<small className="text-muted-foreground">$60 / month</small>
								</div>
							</div>
							<Button>Select</Button>
						</div>
						<div className="flex items-center justify-between gap-8">
							<div className="flex items-center gap-4">
								<User />
								<div className="flex flex-col">
									<span className="font-bold">Business</span>
									<small className="text-muted-foreground">$100 / month</small>
								</div>
							</div>
							<Button variant={'outline'}>Cancel</Button>
						</div>
					</CardContent>
				</form>
			</Card>
		</Form>
	)
}

const paymentMethodSettingsForm = z.object({})

export function PaymentMethodSettingsForm({ cardProps }: CardFormProps) {
	// 1. Define your form.
	const form = useForm<z.infer<typeof paymentMethodSettingsForm>>({
		resolver: zodResolver(paymentMethodSettingsForm),
		defaultValues: {},
	})

	// 2. Define a submit handler.
	function onSubmit(values: z.infer<typeof paymentMethodSettingsForm>) {
		// placeholder
		console.log(values)
	}

	return (
		<Form {...form}>
			<Card {...cardProps} asChild>
				<form onSubmit={form.handleSubmit(onSubmit)}>
					<CardHeader>
						<CardTitle>Payment Methods</CardTitle>
						<CardDescription>Add payment methods for your plan</CardDescription>
					</CardHeader>
					<CardContent className="grid gap-4 md:gap-6"></CardContent>
					<CardFooter className="mt-auto justify-end">
						<Button>Save</Button>
					</CardFooter>
				</form>
			</Card>
		</Form>
	)
}

const billingAddressSettingsForm = z.object({})

export function BillingAddressSettingsForm({ cardProps }: CardFormProps) {
	// 1. Define your form.
	const form = useForm<z.infer<typeof billingAddressSettingsForm>>({
		resolver: zodResolver(billingAddressSettingsForm),
		defaultValues: {},
	})

	// 2. Define a submit handler.
	function onSubmit(values: z.infer<typeof billingAddressSettingsForm>) {
		// placeholder
		console.log(values)
	}

	return (
		<Form {...form}>
			<Card {...cardProps} asChild>
				<form onSubmit={form.handleSubmit(onSubmit)}>
					<CardHeader>
						<CardTitle>Billing Address</CardTitle>
						<CardDescription>
							Add a separate address to your invoices
						</CardDescription>
					</CardHeader>
					<CardContent className="grid gap-4 md:gap-6"></CardContent>
					<CardFooter className="mt-auto justify-end">
						<Button>Save</Button>
					</CardFooter>
				</form>
			</Card>
		</Form>
	)
}

const discountSettingsForm = z.object({})

export function DiscountSettingsForm({ cardProps }: CardFormProps) {
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
					<CardHeader>
						<CardTitle>Discounts</CardTitle>
						<CardDescription>Add discounts to your plan</CardDescription>
					</CardHeader>
					<CardContent className="grid gap-4 md:gap-6"></CardContent>
					<CardFooter className="mt-auto justify-end">
						<Button>Save</Button>
					</CardFooter>
				</form>
			</Card>
		</Form>
	)
}
