import { Path } from 'react-hook-form'
import { FieldProps, LabeledInputField } from '../fields'
import Link from 'next/link'
import { cn } from '@/lib/utils'

export function EmailField<T extends { email: string }>({
	form,
}: FieldProps<T>) {
	return (
		<LabeledInputField
			form={form}
			name={'email' as Path<T>}
			labelProps={{
				children: 'Email',
			}}
		/>
	)
}

export function PasswordField<T extends { password: string }>({
	form,
	displayForgotPassword,
}: FieldProps<T> & {
	displayForgotPassword?: boolean
}) {
	return (
		<LabeledInputField
			form={form}
			name={'password' as Path<T>}
			labelProps={{
				children: displayForgotPassword ? (
					<>
						<span>Password</span>
						<Link href={'/forgot-password'}>Forgot your password?</Link>
					</>
				) : (
					'Password'
				),
				className: cn(displayForgotPassword && 'justify-between'),
			}}
			inputProps={{
				type: 'password',
			}}
		/>
	)
}
