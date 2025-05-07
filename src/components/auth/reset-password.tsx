'use client'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'
import { resetPasswordSchema } from '@/schema/auth'
import { PasswordField } from './fields'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Form } from '../ui/form'

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
					<form>
						<div className="grid gap-6">
							<div className="grid gap-6">
								<div className="grid gap-3">
									<div className="flex items-center">
										<Label htmlFor="new-password">New Password</Label>
									</div>
									<Input
										id="new-password"
										type="password"
										placeholder="************"
										required
									/>
								</div>
								<div className="grid gap-3">
									<div className="flex items-center">
										<Label htmlFor="verify-password">Verify Password</Label>
									</div>
									<Input
										id="verify-password"
										type="password"
										placeholder="************"
										required
									/>
								</div>
								<Button type="submit" className="w-full">
									Reset Password
								</Button>
							</div>
							<div className="text-center text-sm">
								Don&apos;t have an account?{' '}
								<Link href="/signup" className="underline underline-offset-4">
									Sign up
								</Link>
							</div>
						</div>
					</form>
				</CardContent>
			</Card>
			<div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
				By continuing, you agree to our{' '}
				<Link href="/terms">Terms of Service</Link> and{' '}
				<Link href="/privacy">Privacy Policy</Link>.
			</div>
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
	async function onSubmit(values: z.infer<typeof resetPasswordSchema>) {
		// Do something with the form values.
		// ✅ This will be type-safe and validated.
		console.log(values)
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)}>
				<div className="grid gap-6">
					<div className="grid gap-6">
						<PasswordField form={form} />
						<PasswordField form={form} name="verifyPassword" />
						<Button
							type="submit"
							className="w-full"
							loading={form.formState.isSubmitting}
						>
							Continue
						</Button>
					</div>
					<div className="text-center text-sm">
						Don&apos;t have an account?{' '}
						<Link href="/signup" className="underline underline-offset-4">
							Sign up
						</Link>
					</div>
				</div>
			</form>
		</Form>
	)
}
