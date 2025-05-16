'use client'

import { addBillingAddress } from '@/app/actions/organization'
import { Address } from '@/generated/prisma'
import { stringConcatenator, submitter } from '@/lib/utils'
import { addressForm, AddressFormProps } from '@/schema/organization'
import { zodResolver } from '@hookform/resolvers/zod'
import { MapPinPlus, Pencil } from 'lucide-react'
import { ComponentProps } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { AlertDialogFooter } from '../../ui/alert-dialog'
import { Button } from '../../ui/button'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '../../ui/card'
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '../../ui/dialog'
import { Form } from '../../ui/form'
import {
	CityField,
	CountryField,
	StateField,
	StreetOneField,
	StreetTwoField,
	ZipCodeField,
} from '../fields'

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

function RemoveBillingAddress() {
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
						If you remove the address now, you will not be able to use it again
						in the future.
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
