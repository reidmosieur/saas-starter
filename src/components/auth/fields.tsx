import { Path } from 'react-hook-form'
import { FieldProps, LabeledInputField } from '../fields'

export function EmailField<T extends { email: string }>({
	form,
}: FieldProps<T>) {
	return (
		<LabeledInputField form={form} name={'email' as Path<T>} label="Email" />
	)
}

export function PasswordField<T extends { password: string }>({
	form,
}: FieldProps<T>) {
	return (
		<LabeledInputField
			form={form}
			name={'password' as Path<T>}
			label="Password"
		/>
	)
}
