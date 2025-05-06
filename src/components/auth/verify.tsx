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

import { verifyEmailSchema } from '@/schema/auth'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { EmailField, OTPField } from './fields'
import { Form, FormMessage } from '../ui/form'
import { handleVerifyOTP } from '@/app/actions/auth/verify'

export function Verify({ className, ...props }: React.ComponentProps<'div'>) {
	return (
		<div className={cn('flex flex-col gap-6', className)} {...props}>
			<Card>
				<CardHeader className="text-center">
					<CardTitle className="text-xl">Check your email</CardTitle>
					<CardDescription>
						We sent you a code. Please enter it below
					</CardDescription>
				</CardHeader>
				<CardContent>
					<OTPForm />
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

function OTPForm() {
	const form = useForm<z.infer<typeof verifyEmailSchema>>({
		resolver: zodResolver(verifyEmailSchema),
		defaultValues: {
			code: '',
			email: '',
		},
	})

	async function onSubmit(values: z.infer<typeof verifyEmailSchema>) {
		const result = await handleVerifyOTP(values)
		if (result && result.errors) {
			Object.entries(result.errors).map(([key, value]) =>
				form.setError(key as 'email' | 'code' | 'root', value),
			)
		}
	}
	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)}>
				<div className="grid gap-6">
					<div className="grid gap-6">
						<EmailField form={form} />
						<OTPField form={form} />
						{form.formState.errors.root ? (
							<FormMessage>{form.formState.errors.root.message}</FormMessage>
						) : null}
						<Button type="submit" className="w-full">
							Verify
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
