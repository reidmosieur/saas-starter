'use client'

import { Form } from '@/components/ui/form'
import { passwordSchema } from '@/schema/auth'
import { CardFormProps } from '@/types'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { PasswordField } from '../auth/fields'
import { LabeledInputField } from '../fields'
import { Button } from '../ui/button'
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '../ui/card'
import { IconBrandApple, IconBrandGoogle } from '@tabler/icons-react'
import { EllipsisVertical } from 'lucide-react'

const emailSettingsForm = z.object({
	password: passwordSchema,
	verifyPassword: passwordSchema,
})

export function PasswordSettingsForm({ cardProps }: CardFormProps) {
	// 1. Define your form.
	const form = useForm<z.infer<typeof emailSettingsForm>>({
		resolver: zodResolver(emailSettingsForm),
		defaultValues: {
			password: '',
			verifyPassword: '',
		},
	})

	// 2. Define a submit handler.
	function onSubmit(values: z.infer<typeof emailSettingsForm>) {
		// placeholder
		console.log(values)
	}

	return (
		<Form {...form}>
			<Card {...cardProps} asChild>
				<form onSubmit={form.handleSubmit(onSubmit)}>
					<CardHeader>
						<CardTitle>Password</CardTitle>
						<CardDescription>Change your password</CardDescription>
					</CardHeader>
					<CardContent className="grid gap-4 md:gap-6">
						<PasswordField form={form} />
						<LabeledInputField
							form={form}
							name={'verifyPassword'}
							labelProps={{ children: 'Verify Password' }}
						/>
					</CardContent>
					<CardFooter className="mt-auto justify-end">
						<Button loading={form.formState.isSubmitting}>Save</Button>
					</CardFooter>
				</form>
			</Card>
		</Form>
	)
}

const oauthSettingsForm = z.object({
	password: passwordSchema,
	verifyPassword: passwordSchema,
})

export function OAuthSettingsForm({ cardProps }: CardFormProps) {
	// 1. Define your form.
	const form = useForm<z.infer<typeof oauthSettingsForm>>({
		resolver: zodResolver(oauthSettingsForm),
		defaultValues: {
			password: '',
			verifyPassword: '',
		},
	})

	// 2. Define a submit handler.
	function onSubmit(values: z.infer<typeof oauthSettingsForm>) {
		// placeholder
		console.log(values)
	}

	return (
		<Form {...form}>
			<Card {...cardProps} asChild>
				<form onSubmit={form.handleSubmit(onSubmit)}>
					<CardHeader>
						<CardTitle>SSO Methods</CardTitle>
						<CardDescription>
							Change SSO providers, like Google or Apple
						</CardDescription>
					</CardHeader>
					<CardContent className="grid gap-4 md:gap-6">
						<div className="flex items-center justify-between gap-4 md:gap-8">
							<div className="flex items-center gap-2">
								<IconBrandGoogle className="h-10 w-10" />
								<div className="flex flex-col">
									<span className="font-bold">Google</span>
									<small className="text-muted-foreground">username</small>
								</div>
							</div>
							<Button variant={'ghost'}>
								<EllipsisVertical />
							</Button>
						</div>
						<div className="flex items-center justify-between gap-4 md:gap-8">
							<div className="flex items-center gap-2">
								<IconBrandApple className="h-10 w-10" />
								<div className="flex flex-col">
									<span className="font-bold">Apple</span>
									<small className="text-muted-foreground">username</small>
								</div>
							</div>
							<Button variant={'ghost'}>
								<EllipsisVertical />
							</Button>
						</div>
					</CardContent>
				</form>
			</Card>
		</Form>
	)
}
