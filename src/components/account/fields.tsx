import { FieldValues, Path, UseFormReturn } from 'react-hook-form'
import { FieldProps, LabeledInputField } from '../fields'
import { ComponentProps } from 'react'

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
