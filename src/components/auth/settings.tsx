'use client'

import { handleChangePassword } from '@/app/actions/auth/reset-password'
import { Form } from '@/components/ui/form'
import { ConnectionProvider, Session } from '@/generated/prisma'
import { cn, stringConcatenator, submitter } from '@/lib/utils'
import {
	ManageSessionFormProps,
	manageSessionSchema,
	passwordSchema,
	ResetPasswordFormProps,
} from '@/schema/auth'
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
import { revokeUserSessions } from '@/app/actions/auth/sessions'
import { ContinueWithGoogle } from '../continue-with-google'
import { IconBrandGoogle } from '@tabler/icons-react'
import { Skeleton } from '../ui/skeleton'
import { baseUrl, googleRedirectRoute } from '@/constants/routes'

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
	connections,
	userId,
}: CardFormProps<z.infer<typeof oauthSettingsForm>> & {
	connections: Array<{ provider: ConnectionProvider; username: string }>
	userId: number
}) {
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
	const googleConnection = connections.find(
		({ provider }) => provider === 'GOOGLE',
	)

	return (
		<Form {...form}>
			<Card {...cardProps} asChild>
				<form onSubmit={onSubmit}>
					<CardHeader>
						<CardTitle>SSO Methods</CardTitle>
						<CardDescription>Add SSO providers, like Google</CardDescription>
					</CardHeader>
					<CardContent className="grid gap-4 md:gap-6">
						<div className="flex items-center justify-between gap-4 md:gap-8">
							{googleConnection ? (
								<div className="flex items-center gap-6">
									<div className="bg-foreground h-10 w-10 rounded-md p-2">
										<svg
											version="1.1"
											xmlns="http://www.w3.org/2000/svg"
											viewBox="0 0 48 48"
											className="LgbsSe-Bz112c"
										>
											<g>
												<path
													fill="#EA4335"
													d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
												></path>
												<path
													fill="#4285F4"
													d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
												></path>
												<path
													fill="#FBBC05"
													d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
												></path>
												<path
													fill="#34A853"
													d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
												></path>
												<path fill="none" d="M0 0h48v48H0z"></path>
											</g>
										</svg>
									</div>
									<div className="flex flex-col">
										<span className="font-bold">Google</span>
										<small className="text-muted-foreground">
											{googleConnection.username}
										</small>
									</div>
								</div>
							) : (
								<div className="flex h-10 w-full items-center gap-6">
									<ContinueWithGoogle
										clientComponentProps={{
											fallback: <Skeleton className="h-10 w-10" />,
										}}
										googleButtonProps={{
											type: 'icon',
											shape: 'square',
											loginUri:
												baseUrl + googleRedirectRoute + `?connect=${userId}`,
											className: 'w-10',
										}}
									/>
									<span className="font-bold">Add your Google account</span>
								</div>
							)}
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
	currentSession,
}: {
	cardProps?: ComponentProps<'div'>
	sessions: Array<Partial<Session>>
	currentSession: number
}) {
	// 1. Define your form.
	const form = useForm<ManageSessionFormProps>({
		resolver: zodResolver(manageSessionSchema),
		defaultValues: {
			ids: [],
		},
	})

	// 2. Define a submit handler.
	const onSubmit = submitter(form, async (values: ManageSessionFormProps) => {
		return await revokeUserSessions(values)
	})
	const selectedIds = form.watch('ids')
	const allIds = sessions
		.filter(({ id }) => typeof id === 'number')
		.map(({ id }) => id)

	const addIds = (ids: Array<number>) =>
		form.setValue('ids', Array.from(new Set([...selectedIds, ...ids])), {
			shouldDirty: true,
		})
	const removeIds = (ids: Array<number>) =>
		form.setValue(
			'ids',
			selectedIds.filter((id) => !ids.includes(id)),
			{ shouldDirty: true },
		)

	return (
		<Form {...form}>
			<Card {...cardProps} asChild>
				<form onSubmit={onSubmit}>
					<CardHeader className="flex items-start justify-between">
						<div className="grid grid-cols-1 gap-1.5">
							<CardTitle>Sessions</CardTitle>
							<CardDescription>Manage your sessions</CardDescription>
						</div>
						{selectedIds.length > 0 ? (
							<div className="flex gap-2">
								<Button size={'sm'}>Revoke</Button>
							</div>
						) : null}
					</CardHeader>
					<CardContent className="max-w-xs sm:max-w-sm md:max-w-md lg:w-full lg:max-w-none">
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>
										<Checkbox
											checked={
												allIds.length > 0 &&
												allIds.every((id) => selectedIds.includes(id))
											}
											onCheckedChange={(checked) =>
												checked ? addIds(allIds) : removeIds(allIds)
											}
										/>
									</TableHead>
									<TableHead>Status</TableHead>
									<TableHead>Context</TableHead>
									<TableHead>Browser</TableHead>
									<TableHead>Location</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{sessions.map(
									(
										{
											id,
											createdAt,
											context,
											browserName,
											city,
											region,
											revokedAt,
										},
										index,
									) => (
										<TableRow key={index}>
											<TableCell>
												<Checkbox
													checked={!!id && selectedIds.includes(id)}
													onCheckedChange={(checked) =>
														!!id && (checked ? addIds([id]) : removeIds([id]))
													}
												/>
											</TableCell>
											<TableCell
												className={cn(
													currentSession === id
														? 'text-primary'
														: revokedAt
															? 'text-muted-foreground'
															: 'text-green-700 dark:text-green-400',
												)}
											>
												{currentSession === id && createdAt
													? `Current session since ${new Date(createdAt).toLocaleDateString()}`
													: revokedAt
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
										</TableRow>
									),
								)}
							</TableBody>
						</Table>
					</CardContent>
				</form>
			</Card>
		</Form>
	)
}