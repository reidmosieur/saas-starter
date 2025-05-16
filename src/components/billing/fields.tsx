import { verifyPromoCode } from '@/app/actions/stripe'
import { Check, Loader } from 'lucide-react'
import { ComponentProps, Fragment, useEffect, useState } from 'react'
import { Path, WatchObserver } from 'react-hook-form'
import { FieldProps, LabeledInputField } from '../fields'
import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '../ui/form'
import { Input } from '../ui/input'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '../ui/select'
import { cn } from '@/lib/utils'
import { Label } from '../ui/label'

export function StreetOneField<T extends { streetOne: string }>({
	form,
	inputProps,
}: FieldProps<T> & {
	inputProps?: ComponentProps<'input'>
}) {
	return (
		<LabeledInputField
			form={form}
			name={'streetOne' as Path<T>}
			labelProps={{
				children: 'Street',
			}}
			inputProps={inputProps}
		/>
	)
}

export function StreetTwoField<T extends { streetTwo?: string }>({
	form,
	inputProps,
}: FieldProps<T> & {
	inputProps?: ComponentProps<'input'>
}) {
	return (
		<LabeledInputField
			form={form}
			name={'streetTwo' as Path<T>}
			labelProps={{
				children: 'Street Line Two',
			}}
			inputProps={inputProps}
		/>
	)
}

export function CityField<T extends { city: string }>({
	form,
	inputProps,
}: FieldProps<T> & {
	inputProps?: ComponentProps<'input'>
}) {
	return (
		<LabeledInputField
			form={form}
			name={'city' as Path<T>}
			labelProps={{
				children: 'City',
			}}
			inputProps={inputProps}
		/>
	)
}

export function StateField<T extends { state: string }>({
	form,
	inputProps,
}: FieldProps<T> & {
	inputProps?: ComponentProps<'input'>
}) {
	return (
		<LabeledInputField
			form={form}
			name={'state' as Path<T>}
			labelProps={{
				children: 'State',
			}}
			inputProps={inputProps}
		/>
	)
}

export function ZipCodeField<T extends { zipCode: string }>({
	form,
	inputProps = {
		type: 'number',
	},
}: FieldProps<T> & {
	inputProps?: ComponentProps<'input'>
}) {
	return (
		<LabeledInputField
			form={form}
			name={'zipCode' as Path<T>}
			labelProps={{
				children: 'Zip Code',
			}}
			inputProps={inputProps}
		/>
	)
}

export function CountryField<T extends { country: string }>({
	form,
	inputProps,
}: FieldProps<T> & {
	inputProps?: ComponentProps<'input'>
}) {
	return (
		<LabeledInputField
			form={form}
			name={'country' as Path<T>}
			labelProps={{
				children: 'Country',
			}}
			inputProps={inputProps}
		/>
	)
}

export function AddressFields<
	T extends {
		streetOne: string
		streetTwo?: string
		city: string
		state: string
		zipCode: string
		country: string
	},
>({ form }: FieldProps<T>) {
	return (
		<Fragment>
			<StreetOneField form={form} />
			<StreetTwoField form={form} />
			<div className="grid grid-cols-2 gap-x-2 gap-y-4">
				<CityField form={form} />
				<StateField form={form} />
				<ZipCodeField form={form} />
				<CountryField form={form} />
			</div>
		</Fragment>
	)
}

export function CardField<T extends { paymentMethodId: string }>({
	form,
	options,
}: FieldProps<T> & {
	options: Array<{ value: string; label: string }>
}) {
	return (
		<FormField
			control={form.control}
			name={'paymentMethodId' as Path<T>}
			render={({ field }) => (
				<FormItem>
					<FormLabel>Card</FormLabel>
					<Select onValueChange={field.onChange} defaultValue={field.value}>
						<FormControl>
							<SelectTrigger className="w-full">
								<SelectValue placeholder="Select a payment method" />
							</SelectTrigger>
						</FormControl>
						<SelectContent>
							{options.map(({ value, label }) => (
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
	)
}

export function PromoCodeField<T extends { promoCode?: string | undefined }>({
	form,
	inputProps,
}: FieldProps<T> & {
	inputProps?: ComponentProps<'input'>
}) {
	const [code, setCode] = useState('')
	const [validating, setValidating] = useState(false)
	const [valid, setValid] = useState(false)

	const errors = form.formState.errors.promoCode?.message

	// Debounce logic
	useEffect(() => {
		if (!code) {
			form.clearErrors('promoCode' as Path<T>)
			return
		}

		const timeout = setTimeout(async () => {
			setValidating(true)

			const result = await verifyPromoCode(code)
			const promoCode = result.data.at(0)

			setValidating(false)

			if (!promoCode || !promoCode?.active) {
				setValid(false)
				form.setError('promoCode' as Path<T>, {
					message: 'That promo code is invalid',
				})
			} else {
				setValid(true)
				form.clearErrors('promoCode' as Path<T>)
				form.setValue('promoCode' as Path<T>, promoCode.id)
			}
		}, 500) // debounce delay

		return () => clearTimeout(timeout)
	}, [form, code])

	return (
		<div className="grid gap-1.5">
			<Label>Promo Code</Label>
			<div className="relative">
				<Input
					{...inputProps}
					className={cn(
						inputProps?.className,
						valid && 'border-green-700 bg-green-100',
					)}
					onChange={(e) => setCode(e.target.value)}
				/>

				{validating ? (
					<Loader className="absolute top-1/2 right-2 z-10 size-5 -translate-y-1/2 animate-spin" />
				) : valid ? (
					<Check className="absolute top-1/2 right-2 z-10 size-5 -translate-y-1/2 text-green-700 dark:text-green-400" />
				) : null}
			</div>
			{errors ? <small className="text-destructive">{errors}</small> : null}
		</div>
	)
}
