'use client'

import { initializeEmailSignup } from '@/app/actions/auth/signup'
import { Button } from '@/components/ui/button'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import { cn, submitter } from '@/lib/utils'
import { emailSignUpSchema } from '@/schema/auth'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { ContinueWithGoogle } from '../continue-with-google'
import { Form, FormMessage } from '../ui/form'
import { EmailField } from './fields'

export function Signup({ className, ...props }: React.ComponentProps<'div'>) {
	return (
		<div className={cn('flex flex-col gap-6', className)} {...props}>
			<Card>
				<CardHeader className="text-center">
					<CardTitle className="text-xl">Welcome</CardTitle>
					<CardDescription>
						Sign up with your Apple or Google account
					</CardDescription>
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
						<EmailSignupForm />
						<div className="text-center text-sm">
							Already have an account?{' '}
							<Link href="/login" className="underline underline-offset-4">
								Login
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

function EmailSignupForm() {
	const form = useForm<z.infer<typeof emailSignUpSchema>>({
		resolver: zodResolver(emailSignUpSchema),
		defaultValues: {
			email: '',
		},
	})

	const onSubmit = submitter(
		form,
		async (values: z.infer<typeof emailSignUpSchema>) => {
			return await initializeEmailSignup(values)
		},
	)

	return (
		<Form {...form}>
			<form onSubmit={onSubmit} className="grid gap-6">
				{/* don't alert existing accounts to avoid enumeration attacks */}
				<EmailField form={form} />
				{form.formState.errors.root ? (
					<FormMessage>{form.formState.errors.root.message}</FormMessage>
				) : null}
				<Button
					type="submit"
					className="w-full"
					loading={form.formState.isSubmitting}
				>
					Sign Up
				</Button>
			</form>
		</Form>
	)
}
