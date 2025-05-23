import { Path } from 'react-hook-form'
import { FieldProps, LabeledInputField } from '../fields'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import {
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '../ui/form'
import { InputOTP, InputOTPGroup, InputOTPSlot } from '../ui/input-otp'
import { ComponentProps } from 'react'

export function EmailField<T extends { email: string }>({
	form,
	inputProps,
}: FieldProps<T> & {
	inputProps?: ComponentProps<'input'>
}) {
	return (
		<LabeledInputField
			form={form}
			name={'email' as Path<T>}
			labelProps={{
				children: 'Email',
			}}
			inputProps={inputProps}
		/>
	)
}

export function PasswordField<T extends { password: string }>({
	form,
	displayForgotPassword,
	name = 'password',
	inputProps,
}: FieldProps<T> & {
	displayForgotPassword?: boolean
	name?: string
	inputProps?: ComponentProps<'input'>
}) {
	return (
		<LabeledInputField
			form={form}
			name={name as Path<T>}
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
				...inputProps,
			}}
		/>
	)
}

export function OTPField<T extends { code: string }>({
	form,
	inputProps,
}: FieldProps<T> & {
	inputProps?: ComponentProps<'input'>
}) {
	return (
		<FormField
			control={form.control}
			name={'code' as Path<T>}
			render={({ field }) => (
				<FormItem>
					<FormLabel>One-Time Password</FormLabel>
					<FormControl>
						<InputOTP
							maxLength={6}
							{...inputProps}
							{...field}
							className="w-full"
						>
							<InputOTPGroup className="w-full">
								{Array.from({ length: 6 }).map((_, index) => (
									<InputOTPSlot className="w-full" key={index} index={index} />
								))}
							</InputOTPGroup>
						</InputOTP>
					</FormControl>
					<FormDescription>
						Please enter the one-time password sent to your email
					</FormDescription>
					<FormMessage />
				</FormItem>
			)}
		/>
	)
}