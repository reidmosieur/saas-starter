'use client'

import { Check, ChevronDown } from 'lucide-react'

import { Button, ButtonProps } from '@/components/ui/button'
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from '@/components/ui/command'
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import countries from 'i18n-iso-countries'
import countriesLocale from 'i18n-iso-countries/langs/en.json'
import { ComponentProps } from 'react'
import { FieldValues, Path, UseFormReturn } from 'react-hook-form'
import { FieldProps, LabeledInputField } from '../fields'
import { FormField, FormItem, FormLabel, FormMessage } from '../ui/form'

type UsernameFieldProps<T extends FieldValues & { username: string }> = {
	form: UseFormReturn<T>
	inputProps?: ComponentProps<'input'>
}

export function UsernameField<T extends { username: string }>({
	form,
	inputProps,
}: UsernameFieldProps<T> & {
	inputProps?: ComponentProps<'input'>
}) {
	return (
		<LabeledInputField
			form={form}
			name={'username' as Path<T>}
			labelProps={{ children: 'Username' }}
			inputProps={inputProps}
		/>
	)
}

export function FirstNameField<T extends { firstName: string }>({
	form,
	inputProps,
}: FieldProps<T> & {
	inputProps?: ComponentProps<'input'>
}) {
	return (
		<LabeledInputField
			form={form}
			name={'firstName' as Path<T>}
			labelProps={{ children: 'First Name' }}
			inputProps={inputProps}
		/>
	)
}

export function LastNameField<T extends { lastName: string }>({
	form,
	inputProps,
}: FieldProps<T> & {
	inputProps?: ComponentProps<'input'>
}) {
	return (
		<LabeledInputField
			form={form}
			name={'lastName' as Path<T>}
			labelProps={{ children: 'Last Name' }}
			inputProps={inputProps}
		/>
	)
}

type NameFieldProps<T extends { firstName: string; lastName: string }> = {
	form: UseFormReturn<T>
}

export function NameField<T extends { firstName: string; lastName: string }>({
	form,
	firstNameInputProps,
	lastNameInputProps,
}: NameFieldProps<T> & {
	firstNameInputProps?: ComponentProps<'input'>
	lastNameInputProps?: ComponentProps<'input'>
}) {
	return (
		<div className="grid grid-cols-2 gap-4">
			<FirstNameField form={form} inputProps={firstNameInputProps} />
			<LastNameField form={form} inputProps={lastNameInputProps} />
		</div>
	)
}

type PhoneNumberProps<
	T extends {
		phoneNumber?: string | undefined
		countryCode?: string | undefined
	},
> = {
	form: UseFormReturn<T>
}

export function PhoneNumberField<
	T extends {
		phoneNumber?: string | undefined
		countryCode?: string | undefined
	},
>({ form }: PhoneNumberProps<T>) {
	return (
		<div className="grid grid-cols-2 gap-4">
			<LabeledInputField
				form={form}
				name={'countryCode' as Path<T>}
				labelProps={{ children: 'Country Code' }}
			/>
			<LabeledInputField
				form={form}
				name={'phoneNumber' as Path<T>}
				labelProps={{ children: 'Phone Number' }}
			/>
		</div>
	)
}

type CountriesComboboxProps<
	T extends {
		countryCode?: string | undefined
	},
> = {
	form: UseFormReturn<T>
}

countries.registerLocale(countriesLocale)
export function CountriesCombobox<T extends { countryCode: string }>({
	form,
	buttonProps = {
		variant: 'ghost',
		role: 'combobox',
		className: 'w-fit justify-between',
	},
}: CountriesComboboxProps<T> & {
	buttonProps?: ButtonProps
}) {
	const countryCodesObject = countries.getAlpha2Codes()
	const countryCodes = Object.entries(countryCodesObject)

	return (
		<FormField
			control={form.control}
			name={'countryCode' as Path<T>}
			render={({ field }) => (
				<FormItem>
					<Popover>
						<PopoverTrigger asChild>
							<Button {...buttonProps}>
								<span
									className={cn(
										'fi',
										`fi-${field.value ? field.value.toLowerCase() : 'us'}`,
									)}
								></span>
								<ChevronDown />
							</Button>
						</PopoverTrigger>
						<PopoverContent className="z-[9999] w-fit p-0" align="start">
							<Command>
								<CommandInput placeholder="Country" />
								<CommandList>
									<CommandEmpty>Country not found.</CommandEmpty>
									<CommandGroup>
										{countryCodes.map(([code]) => (
											<CommandItem
												key={code}
												value={code}
												onSelect={(currentValue) => {
													form.setValue('countryCode' as Path<T>, currentValue)
												}}
											>
												<Check
													className={cn(
														'mr-2 h-4 w-4',
														field.value === code ? 'opacity-100' : 'opacity-0',
													)}
												/>
												<span
													className={cn('fi', `fi-${code.toLowerCase()}`)}
												></span>
												<span>{code}</span>{' '}
												<span>{countries.getName(code, 'en')}</span>
											</CommandItem>
										))}
									</CommandGroup>
								</CommandList>
							</Command>
						</PopoverContent>
					</Popover>
				</FormItem>
			)}
		/>
	)
}

export function PhoneNumberFlagField<
	T extends { countryCode: string; phoneNumber: string },
>({ form }: PhoneNumberProps<T>) {
	return (
		<FormItem>
			<FormLabel>Phone number</FormLabel>
			<div className="flex gap-2 rounded-md border shadow">
				<CountriesCombobox form={form} />
				<FormField
					control={form.control}
					name={'phoneNumber' as Path<T>}
					render={({ field }) => (
						<FormItem>
							<input className="w-full focus:outline-none" {...field} />
						</FormItem>
					)}
				/>
			</div>
			{form.getFieldState('countryCode' as Path<T>).error ? (
				<FormMessage>
					{form.getFieldState('countryCode' as Path<T>).error?.message}
				</FormMessage>
			) : null}
			{form.getFieldState('phoneNumber' as Path<T>).error ? (
				<FormMessage>
					{form.getFieldState('phoneNumber' as Path<T>).error?.message}
				</FormMessage>
			) : null}
		</FormItem>
	)
}
