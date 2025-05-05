import { FieldValues, Path, UseFormReturn } from 'react-hook-form'
import { FieldProps, LabeledInputField } from '../fields'

type UsernameFieldProps<T extends FieldValues & { username: string }> = {
	form: UseFormReturn<T>
}

export function UsernameField<T extends { username: string }>({
	form,
}: UsernameFieldProps<T>) {
	return (
		<LabeledInputField
			form={form}
			name={'username' as Path<T>}
			labelProps={{ children: 'Username' }}
		/>
	)
}

export function FirstNameField<T extends { firstName: string }>({
	form,
}: FieldProps<T>) {
	return (
		<LabeledInputField
			form={form}
			name={'firstName' as Path<T>}
			labelProps={{ children: 'First Name' }}
		/>
	)
}

export function LastNameField<T extends { lastName: string }>({
	form,
}: FieldProps<T>) {
	return (
		<LabeledInputField
			form={form}
			name={'lastName' as Path<T>}
			labelProps={{ children: 'Last Name' }}
		/>
	)
}

type NameFieldProps<T extends { firstName: string; lastName: string }> = {
	form: UseFormReturn<T>
}

export function NameField<T extends { firstName: string; lastName: string }>({
	form,
}: NameFieldProps<T>) {
	return (
		<div className="grid grid-cols-2 gap-4">
			<FirstNameField form={form} />
			<LastNameField form={form} />
		</div>
	)
}

type PhoneNumberProps<
	T extends { phoneNumber: { countryCode: string; number: string } },
> = {
	form: UseFormReturn<T>
}

export function PhoneNumberField<
	T extends { phoneNumber: { countryCode: string; number: string } },
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
				name={'number' as Path<T>}
				labelProps={{ children: 'Phone Number' }}
			/>
		</div>
	)
}
