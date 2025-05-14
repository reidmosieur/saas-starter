'use client'

import { handleLogin } from '@/app/actions/auth/login'
import { Button } from '@/components/ui/button'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import { cn, submitter } from '@/lib/utils'
import { emailLoginSchema } from '@/schema/auth'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Form, FormMessage } from '../ui/form'
import { EmailField, PasswordField } from './fields'
import { baseUrl, googleRedirectRoute } from '@/constants/routes'
import { ContinueWithGoogle } from '../continue-with-google'

const clientId = process.env.GOOGLE_OAUTH_CLIENT_ID

export function Login({ className, ...props }: React.ComponentProps<'div'>) {
	return (
		<div className={cn('flex flex-col gap-6', className)} {...props}>
			<Card>
				<CardHeader className="text-center">
					<CardTitle className="text-xl">Welcome back</CardTitle>
					<CardDescription>Login with your Google account</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="grid gap-6">
						<div className="flex flex-col gap-4">
							<ContinueWithGoogle />
						</div>
						<div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
							<span className="bg-card text-muted-foreground relative z-10 px-2">
								Or continue with
							</span>
						</div>
						<EmailLoginForm />
						<div className="text-center text-sm">
							Don&apos;t have an account?{' '}
							<Link href="/signup" className="underline underline-offset-4">
								Sign up
							</Link>
						</div>
					</div>
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

function EmailLoginForm() {
	// 1. Define your form.
	const form = useForm<z.infer<typeof emailLoginSchema>>({
		resolver: zodResolver(emailLoginSchema),
		defaultValues: {
			email: '',
			password: '',
		},
	})

	// 2. Define a submit handler.
	const onSubmit = submitter(
		form,
		async (values: z.infer<typeof emailLoginSchema>) => {
			return await handleLogin(values)
		},
	)
	return (
		<Form {...form}>
			<form onSubmit={onSubmit} className="grid gap-6">
				<EmailField form={form} />
				<PasswordField form={form} displayForgotPassword />
				{form.formState.errors.root ? (
					<FormMessage>{form.formState.errors.root.message}</FormMessage>
				) : null}
				<Button
					type="submit"
					className="w-full"
					loading={form.formState.isSubmitting}
				>
					Login
				</Button>
			</form>
		</Form>
	)
}
