'use client'

import { handleChangePassword } from '@/app/actions/auth/reset-password'
import { Form } from '@/components/ui/form'
import { Session } from '@/generated/prisma'
import { cn, stringConcatenator, submitter } from '@/lib/utils'
import { passwordSchema, ResetPasswordFormProps } from '@/schema/auth'
import { CardFormProps } from '@/types'
import { zodResolver } from '@hookform/resolvers/zod'
import { EllipsisVertical } from 'lucide-react'
import { ComponentProps } from 'react'
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
import { Checkbox } from '../ui/checkbox'
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '../ui/table'

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
							<div className="flex items-center gap-6">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 24 24"
									className="h-6 w-6"
								>
									<path
										d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
										fill="currentColor"
									/>
								</svg>
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
							<div className="flex items-center gap-6">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 24 24"
									className="h-6 w-6"
								>
									<path
										d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701"
										fill="currentColor"
									/>
								</svg>
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

export function SessionsTable({
	cardProps,
	sessions,
}: {
	cardProps?: ComponentProps<'div'>
	sessions: Array<Partial<Session>>
}) {
	return (
		<Card {...cardProps}>
			<CardHeader>
				<CardTitle>Sessions</CardTitle>
				<CardDescription>Manage your sessions</CardDescription>
			</CardHeader>
			<CardContent>
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead />
							<TableHead>Status</TableHead>
							<TableHead>Context</TableHead>
							<TableHead>Browser</TableHead>
							<TableHead>Location</TableHead>
							<TableHead />
						</TableRow>
					</TableHeader>
					<TableBody>
						{sessions.map(
							(
								{ createdAt, context, browserName, city, region, revokedAt },
								index,
							) => (
								<TableRow key={index}>
									<TableCell>
										<Checkbox />
									</TableCell>
									<TableCell
										className={cn(
											revokedAt
												? 'text-muted-foreground'
												: 'text-green-700 dark:text-green-400',
										)}
									>
										{revokedAt
											? `Revoked since ${new Date(revokedAt).toLocaleDateString()}`
											: createdAt
												? `Active since ${new Date(createdAt).toLocaleDateString()}`
												: null}
									</TableCell>
									<TableCell>{context}</TableCell>
									<TableCell>{browserName}</TableCell>
									<TableCell>
										{stringConcatenator([city, region], ', ')}
									</TableCell>
									<TableCell align="right">
										<Button variant={'ghost'}>
											<EllipsisVertical />
										</Button>
									</TableCell>
								</TableRow>
							),
						)}
					</TableBody>
				</Table>
			</CardContent>
		</Card>
	)
}