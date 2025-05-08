'use client'

import { resetPassword } from '@/app/actions/auth/reset-password'
import { Button } from '@/components/ui/button'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import { cn, submitter } from '@/lib/utils'
import { resetPasswordSchema } from '@/schema/auth'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Form, FormMessage } from '../ui/form'
import { PasswordField } from './fields'

export function ResetPassword({
	className,
	...props
}: React.ComponentProps<'div'>) {
	return (
		<div className={cn('flex flex-col gap-6', className)} {...props}>
			<Card>
				<CardHeader className="text-center">
					<CardTitle className="text-xl">Reset password</CardTitle>
					<CardDescription>Great! Set your new password</CardDescription>
				</CardHeader>
				<CardContent>
					<ResetPasswordForm />
				</CardContent>
			</Card>
		</div>
	)
}

export function ResetPasswordForm() {
	// 1. Define your form.
	const form = useForm<z.infer<typeof resetPasswordSchema>>({
		resolver: zodResolver(resetPasswordSchema),
		defaultValues: {
			password: '',
			verifyPassword: '',
		},
	})

	// 2. Define a submit handler.
	const onSubmit = submitter(
		form,
		async (values: z.infer<typeof resetPasswordSchema>) => {
			return await resetPassword(values)
		},
	)

	return (
		<Form {...form}>
			<form onSubmit={onSubmit}>
				<div className="grid gap-6">
					<div className="grid gap-6">
						<PasswordField form={form} />
						<PasswordField form={form} name="verifyPassword" />
						{form.formState.errors.root ? (
							<FormMessage>{form.formState.errors.root.message}</FormMessage>
						) : null}
						<Button
							type="submit"
							className="w-full"
							loading={form.formState.isSubmitting}
						>
							Continue
						</Button>
					</div>
				</div>
			</form>
		</Form>
	)
}
