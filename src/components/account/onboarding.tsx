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
import { onboardingSchema } from '@/schema/account'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Form } from '../ui/form'
import { NameField, PhoneNumberField, UsernameField } from './fields'

export function Onboarding({
	className,
	...props
}: React.ComponentProps<'div'>) {
	return (
		<div className={cn('flex flex-col gap-6', className)} {...props}>
			<Card>
				<CardHeader className="text-center">
					<CardTitle className="text-xl">Welcome</CardTitle>
					<CardDescription>Continue setting up your account</CardDescription>
				</CardHeader>
				<CardContent>
					<OnboardingForm />
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

function OnboardingForm() {
	// 1. Define your form.
	const form = useForm<z.infer<typeof onboardingSchema>>({
		resolver: zodResolver(onboardingSchema),
		defaultValues: {
			firstName: '',
			lastName: '',
			username: '',
		},
	})

	// 2. Define a submit handler.
	async function onSubmit(values: z.infer<typeof onboardingSchema>) {
		// Do something with the form values.
		// ✅ This will be type-safe and validated.
		console.log(values)
	}
	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)}>
				<div className="grid gap-6">
					<div className="grid gap-6">
						<UsernameField form={form} />
						<NameField form={form} />
						<PhoneNumberField form={form} />
						<Button type="submit" className="w-full">
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
