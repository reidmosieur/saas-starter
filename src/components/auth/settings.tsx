'use client'

import { handleChangePassword } from '@/app/actions/auth/reset-password'
import { Form } from '@/components/ui/form'
import { submitter } from '@/lib/utils'
import { passwordSchema, ResetPasswordFormProps } from '@/schema/auth'
import { CardFormProps } from '@/types'
import { zodResolver } from '@hookform/resolvers/zod'
import { IconBrandApple, IconBrandGoogle } from '@tabler/icons-react'
import { EllipsisVertical } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'
import { PasswordField } from '../auth/fields'
import { Button } from '../ui/button'
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '../ui/card'

const emailSettingsForm = z.object({
	password: passwordSchema,
	verifyPassword: passwordSchema,
})

export function PasswordSettingsForm({
	cardProps,
}: CardFormProps<ResetPasswordFormProps>) {
	// 1. Define your form.
	const form = useForm<ResetPasswordFormProps>({
		resolver: zodResolver(emailSettingsForm),
		defaultValues: {
			password: '',
			verifyPassword: '',
		},
	})

	// 2. Define a submit handler.
	const onSubmit = submitter(
		form,
		async (values: ResetPasswordFormProps) => {
			return await handleChangePassword(values)
		},
		{
			onSuccess: () => {
				toast.success('Successfully updated your avatar settings')
			},
		},
	)

	return (
		<Form {...form}>
			<Card {...cardProps} asChild>
				<form onSubmit={onSubmit}>
					<CardHeader>
						<CardTitle>Password</CardTitle>
						<CardDescription>Change your password</CardDescription>
					</CardHeader>
					<CardContent className="grid gap-4 md:gap-6">
						<PasswordField form={form} />
						<PasswordField form={form} name="verifyPassword" />
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

export function OAuthSettingsForm({
	cardProps,
}: CardFormProps<z.infer<typeof oauthSettingsForm>>) {
	// 1. Define your form.
	const form = useForm<z.infer<typeof oauthSettingsForm>>({
		resolver: zodResolver(oauthSettingsForm),
		defaultValues: {
			password: '',
			verifyPassword: '',
		},
	})

	// 2. Define a submit handler.
	const onSubmit = submitter(
		form,
		(values: z.infer<typeof oauthSettingsForm>) => {
			// placeholder
			console.log(values)
		},
	)

	return (
		<Form {...form}>
			<Card {...cardProps} asChild>
				<form onSubmit={onSubmit}>
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
