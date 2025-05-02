import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { UseFormReturn, FieldValues, Path } from 'react-hook-form'
import { FieldProps, LabeledInputField } from '../fields'

type UsernameFieldProps<T extends FieldValues & { username: string }> = {
	form: UseFormReturn<T>
}

export function UsernameField<T extends { username: string }>({
	form,
}: UsernameFieldProps<T>) {
	return (
		<FormField
			control={form.control}
			name={'username' as Path<T>}
			render={({ field }) => (
				<FormItem>
					<FormLabel>Username</FormLabel>
					<FormControl>
						<Input {...field} />
					</FormControl>
					<FormMessage />
				</FormItem>
			)}
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
			label="First Name"
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
			label="Last Name"
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
				label="Country Code"
			/>
			<LabeledInputField
				form={form}
				name={'number' as Path<T>}
				label="Phone Number"
			/>
		</div>
	)
}
