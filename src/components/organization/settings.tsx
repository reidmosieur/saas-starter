'use client'

import { updateOrganizationInfoSettingsForm } from '@/app/actions/organization'
import { Form } from '@/components/ui/form'
import { submitter } from '@/lib/utils'
import {
	organizationInfoSettingsForm,
	OrganizationInfoSettingsFormProps,
} from '@/schema/organization'
import { CardFormProps } from '@/types'
import { zodResolver } from '@hookform/resolvers/zod'
import { EllipsisVertical, UserPlus } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { Button } from '../ui/button'
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '../ui/card'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '../ui/table'
import { OrganizationNameField } from './fields'
import { ComponentProps } from 'react'
import { Permission, Role, User } from '@/generated/prisma'

export function OrganizationInfoSettingsForm({
	cardProps,
	defaultValues,
}: CardFormProps<OrganizationInfoSettingsFormProps>) {
	// 1. Define your form.
	const form = useForm<OrganizationInfoSettingsFormProps>({
		resolver: zodResolver(organizationInfoSettingsForm),
		defaultValues,
	})

	// 2. Define a submit handler.
	const onSubmit = submitter(
		form,
		async (values: OrganizationInfoSettingsFormProps) => {
			return await updateOrganizationInfoSettingsForm(values)
		},
		{
			onSuccess: () => {
				toast.success('Successfully update your organization name')
			},
		},
	)

	return (
		<Form {...form}>
			<Card {...cardProps} asChild>
				<form onSubmit={onSubmit}>
					<CardHeader>
						<CardTitle>Organization Information</CardTitle>
						<CardDescription>Change your organizations name</CardDescription>
					</CardHeader>
					<CardContent className="grid gap-4 md:gap-6">
						<OrganizationNameField form={form} />
					</CardContent>
					<CardFooter className="mt-auto justify-end">
						<Button loading={form.formState.isSubmitting}>Save</Button>
					</CardFooter>
				</form>
			</Card>
		</Form>
	)
}

export function OrganizationUsers({
	cardProps,
	users,
}: {
	cardProps: ComponentProps<'div'>
	users: Array<
		Partial<
			User & {
				roles: Array<Partial<Role>>
			}
		>
	>
}) {
	return (
		<Card {...cardProps}>
			<CardHeader className="flex flex-row justify-between gap-4">
				<div>
					<CardTitle>Users</CardTitle>
					<CardDescription>Change your organizations users</CardDescription>
				</div>
				<Button variant={'outline'} size={'sm'}>
					Invite <UserPlus />
				</Button>
			</CardHeader>
			<CardContent>
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Email</TableHead>
							<TableHead>Name</TableHead>
							<TableHead>Roles</TableHead>
							<TableHead>Status</TableHead>
							<TableHead />
						</TableRow>
					</TableHeader>
					<TableBody>
						{users.length > 0
							? users.map(
									({ firstName, lastName, email, createdAt, roles }, index) => (
										<TableRow key={index}>
											<TableCell>{email}</TableCell>
											<TableCell>
												{firstName} {lastName}
											</TableCell>
											<TableCell>
												{roles?.map(({ name }) => name).join(', ')}
											</TableCell>
											<TableCell className="text-green-700 dark:text-green-400">
												{createdAt ? (
													<span>
														Active since{' '}
														{new Date(createdAt).toLocaleDateString()}
													</span>
												) : null}
											</TableCell>
											<TableCell align="right">
												<Popover>
													<PopoverTrigger asChild>
														<Button variant={'ghost'}>
															<EllipsisVertical />
														</Button>
													</PopoverTrigger>
													<PopoverContent
														align="end"
														className="flex flex-col gap-2"
													>
														<Button variant={'outline'}>Edit</Button>
														<Button variant={'outline'}>Deactivate</Button>
														<Button variant={'destructive'}>Delete</Button>
													</PopoverContent>
												</Popover>
											</TableCell>
										</TableRow>
									),
								)
							: null}
					</TableBody>
				</Table>
			</CardContent>
		</Card>
	)
}

export function OrganizationRoles({
	cardProps,
	roles,
}: {
	cardProps: ComponentProps<'div'>
	roles: Array<
		Partial<
			Role & {
				users: Array<Partial<User>>
				permissions: Array<Partial<Permission>>
				_count: {
					users: number
					permissions: number
				}
			}
		>
	>
}) {
	return (
		<Card {...cardProps}>
			<CardHeader className="flex flex-row justify-between gap-4">
				<div>
					<CardTitle>Roles</CardTitle>
					<CardDescription>Change your organizations roles</CardDescription>
				</div>
				<Button variant={'outline'} size={'sm'}>
					Add
				</Button>
			</CardHeader>
			<CardContent>
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Name</TableHead>
							<TableHead>Users</TableHead>
							<TableHead>Permissions</TableHead>
							<TableHead />
						</TableRow>
					</TableHeader>
					<TableBody>
						{roles.length > 0
							? roles.map(({ name, users, permissions, _count }, index) => (
									<TableRow key={index}>
										<TableCell>{name}</TableCell>
										<TableCell>
											<UsersCell users={users} count={_count?.users ?? 0} />
										</TableCell>
										<TableCell>
											<PermissionsCell
												permissions={permissions}
												count={_count?.permissions ?? 0}
											/>
										</TableCell>
										<TableCell align="right">
											<Popover>
												<PopoverTrigger asChild>
													<Button variant={'ghost'}>
														<EllipsisVertical />
													</Button>
												</PopoverTrigger>
												<PopoverContent
													align="end"
													className="flex flex-col gap-2"
												>
													<Button variant={'outline'}>Edit</Button>
													<Button variant={'destructive'}>Delete</Button>
												</PopoverContent>
											</Popover>
										</TableCell>
									</TableRow>
								))
							: null}
					</TableBody>
				</Table>
			</CardContent>
		</Card>
	)
}

function UsersCell({
	users,
	count,
}: {
	users?: Array<Partial<User>>
	count: number
}) {
	if (!users || users.length < 1) {
		return 'No users'
	}

	let permissionsText = users
		?.map(({ firstName, lastName }) => `${firstName} ${lastName}`)
		.join(', ')

	const additionalUsersCount = count - 2
	if (additionalUsersCount > 1) {
		permissionsText += ` and ${additionalUsersCount} more`
	}

	return permissionsText
}

function PermissionsCell({
	permissions,
	count,
}: {
	permissions?: Array<Partial<Permission>>
	count: number
}) {
	if (!permissions || permissions.length < 1) {
		return 'No permissions'
	}

	let permissionsText = permissions?.map(({ name }) => name).join(', ')

	const additionalPermissionsCount = count - 2
	if (additionalPermissionsCount > 1) {
		permissionsText += ` and ${additionalPermissionsCount} more`
	}

	return permissionsText
}