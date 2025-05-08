'use client'

import { Button } from '@/components/ui/button'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { forgotPasswordSchema } from '@/schema/auth'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Form, FormMessage } from '../ui/form'
import { EmailField } from './fields'
import { initializeForgotPassword } from '@/app/actions/auth/forgot-password'

export function ForgotPassword({
	className,
	...props
}: React.ComponentProps<'div'>) {
	return (
		<div className={cn('flex flex-col gap-6', className)} {...props}>
			<Card>
				<CardHeader className="text-center">
					<CardTitle className="text-xl">Forgot password</CardTitle>
					<CardDescription>
						No worries! Let&apos;s get you signed back in
					</CardDescription>
				</CardHeader>
				<CardContent>
					<ForgotPasswordForm />
				</CardContent>
			</Card>
		</div>
	)
}

export function ForgotPasswordForm() {
	// 1. Define your form.
	const form = useForm<z.infer<typeof forgotPasswordSchema>>({
		resolver: zodResolver(forgotPasswordSchema),
		defaultValues: {
			email: '',
		},
	})

	// 2. Define a submit handler.
	async function onSubmit(values: z.infer<typeof forgotPasswordSchema>) {
		// Do something with the form values.
		// ✅ This will be type-safe and validated.
		const result = await initializeForgotPassword(values)
		if (result && result.errors) {
			Object.entries(result.errors).map(([key, value]) =>
				form.setError(key as 'email' | 'root', value),
			)
		}
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)}>
				<div className="grid gap-6">
					<div className="grid gap-6">
						<EmailField form={form} />
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
					<div className="grid grid-cols-2 text-center text-sm">
						<Link href="/login" className="underline underline-offset-4">
							Login
						</Link>

						<Link href="/signup" className="underline underline-offset-4">
							Sign up
						</Link>
					</div>
				</div>
			</form>
		</Form>
	)
}
