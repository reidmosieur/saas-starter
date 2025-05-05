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

export function OTPField<T extends { otp: string }>({ form }: FieldProps<T>) {
	return (
		<FormField
			control={form.control}
			name={'otp' as Path<T>}
			render={({ field }) => (
				<FormItem>
					<FormLabel>One-Time Password</FormLabel>
					<FormControl>
						<InputOTP maxLength={6} {...field} className="w-full">
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