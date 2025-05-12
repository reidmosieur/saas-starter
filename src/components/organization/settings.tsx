'use client'

import {
	createOrganizationRole,
	sendOrganizationInvitation,
	updateOrganizationInfoSettingsForm,
} from '@/app/actions/organization'
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form'
import { permissionsArray } from '@/constants/permissions'
import { Permission, Role, User } from '@/generated/prisma'
import { cn, submitter } from '@/lib/utils'
import {
	inviteUserForm,
	InviteUserFormProps,
	newRoleForm,
	NewRoleFormProps,
	organizationInfoSettingsForm,
	OrganizationInfoSettingsFormProps,
} from '@/schema/organization'
import { CardFormProps } from '@/types'
import { zodResolver } from '@hookform/resolvers/zod'
import { EllipsisVertical, UserPlus } from 'lucide-react'
import { ComponentProps, useMemo, useState } from 'react'
import { useForm, UseFormReturn } from 'react-hook-form'
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
import { Checkbox } from '../ui/checkbox'
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '../ui/dialog'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { ScrollArea } from '../ui/scroll-area'
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '../ui/table'
import { OrganizationNameField, SelectRoleField } from './fields'
import { EmailField } from '../auth/fields'
import { NameField } from '../account/fields'

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
	roles,
	readOnly,
}: {
	cardProps: ComponentProps<'div'>
	users: Array<
		Partial<
			User & {
				roles: Array<Partial<Role>>
			}
		>
	>
	roles: Array<Partial<Role>>
	readOnly: boolean
}) {
	return (
		<Card {...cardProps}>
			<CardHeader className="flex flex-row justify-between gap-4">
				<div>
					<CardTitle>Users</CardTitle>
					<CardDescription>Change your organizations users</CardDescription>
				</div>
				{/* 
					optionally could display and just disable the button
					but that would require additional form validation
					the simplest solution is to just never render the invite form
				*/}
				{readOnly ? null : <InviteUser roles={roles} />}
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
									(
										{
											firstName,
											lastName,
											email,
											onboarded,
											invitedAt,
											suspended,
											roles,
										},
										index,
									) => (
										<TableRow key={index}>
											<TableCell>{email}</TableCell>
											<TableCell>
												{firstName} {lastName}
											</TableCell>
											<TableCell>
												{roles?.map(({ name }) => name).join(', ')}
											</TableCell>
											<TableCell
												className={cn(
													suspended && 'text-destructive',
													onboarded &&
														!suspended &&
														'text-green-700 dark:text-green-400',
													invitedAt && 'text-muted-foreground',
												)}
											>
												{suspended ? (
													<span>
														Suspended on{' '}
														{new Date(suspended).toLocaleDateString()}
													</span>
												) : onboarded ? (
													<span>
														Active since{' '}
														{new Date(onboarded).toLocaleDateString()}
													</span>
												) : invitedAt ? (
													<span>
														Invited on{' '}
														{new Date(invitedAt).toLocaleDateString()}
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
														<Button variant={'outline'}>Suspend</Button>
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

function InviteUser({ roles }: { roles: Array<Partial<Role>> }) {
	// 1. Define your form.
	const form = useForm<InviteUserFormProps>({
		resolver: zodResolver(inviteUserForm),
		defaultValues: {
			email: '',
			firstName: '',
			lastName: '',
		},
	})

	// 2. Define a submit handler.
	const onSubmit = submitter(
		form,
		async (values: InviteUserFormProps) => {
			return await sendOrganizationInvitation(values)
		},
		{
			onSuccess: () => {
				toast.success('Successfully update your organization name')
			},
		},
	)
	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button variant={'outline'} size={'sm'}>
					Invite <UserPlus />
				</Button>
			</DialogTrigger>
			<DialogContent>
				<Form {...form}>
					<form onSubmit={onSubmit}>
						<DialogHeader>
							<DialogTitle>Invite a user</DialogTitle>
							<DialogDescription>
								Enter the email of the user you&apos;d like to invite.
							</DialogDescription>
						</DialogHeader>
						<div className="space-y-8 py-4">
							<EmailField form={form} />
							<NameField form={form} />
							<SelectRoleField
								form={form}
								options={roles.map(({ name, id }) => ({
									label: name,
									value: id,
								}))}
							/>
						</div>
						<DialogFooter>
							<DialogClose asChild>
								<Button variant={'outline'}>Cancel</Button>
							</DialogClose>
							<Button type="submit">Send invitation</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	)
}

export function OrganizationRoles({
	cardProps,
	roles,
	readOnly,
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
	readOnly: boolean
}) {
	return (
		<Card {...cardProps}>
			<CardHeader className="flex flex-row justify-between gap-4">
				<div>
					<CardTitle>Roles</CardTitle>
					<CardDescription>Change your organizations roles</CardDescription>
				</div>
				{/* 
					optionally could display and just disable the button
					but that would require additional form validation
					the simplest solution is to just never render the invite form
				*/}
				{readOnly ? null : <AddOrganizationRole />}
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

function AddOrganizationRole() {
	// 1. Define your form.
	const form = useForm<NewRoleFormProps>({
		resolver: zodResolver(newRoleForm),
		defaultValues: {
			name: '',
			permissions: [],
		},
	})

	// 2. Define a submit handler.
	const onSubmit = submitter(
		form,
		async (values: NewRoleFormProps) => {
			return await createOrganizationRole(values)
		},
		{
			onSuccess: () => {
				toast.success('Successfully update your organization name')
			},
		},
	)
	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button variant={'outline'} size={'sm'}>
					Add
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-screen-xl">
				<Form {...form}>
					<form onSubmit={onSubmit}>
						<DialogHeader>
							<DialogTitle>Create Role</DialogTitle>
							<DialogDescription>
								Create a role for your organization to control the level of
								access your organizations users get
							</DialogDescription>
						</DialogHeader>
						<div className="space-y-8 py-4">
							<FormField
								control={form.control}
								name="name"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Name</FormLabel>
										<FormControl>
											<Input {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="name"
								render={() => <PermissionsField form={form} />}
							/>
						</div>
						<DialogFooter>
							<DialogClose asChild>
								<Button variant={'outline'}>Cancel</Button>
							</DialogClose>
							<Button>Create</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	)
}

function PermissionsField({
	form,
}: {
	form: UseFormReturn<
		{
			permissions: string[]
			name: string
		},
		any,
		{
			permissions: string[]
			name: string
		}
	>
}) {
	const [filter, setFilter] = useState<string>('')

	const permissions = form.watch('permissions')

	const handleCheckboxChange = (key: string, checked: boolean) => {
		const current = new Set(form.getValues('permissions'))
		if (checked) {
			current.add(key)
		} else {
			current.delete(key)
		}
		form.setValue('permissions', Array.from(current))
	}

	const groupedPermissions = useMemo(() => {
		return permissionsArray.reduce<
			Record<string, { key: string; entity: string }[]>
		>((acc, perm) => {
			if (!acc[perm.entity]) acc[perm.entity] = []
			acc[perm.entity].push(perm)
			return acc
		}, {})
	}, [])

	return (
		<FormItem>
			<FormLabel>Permissions</FormLabel>
			<FormControl>
				<ScrollArea className="max-h-64 pr-2">
					<div className="space-y-8">
						<div className="grid grid-cols-10 gap-8">
							<Input
								className="col-span-9 w-full grow"
								placeholder="Filter"
								value={filter}
								onChange={(e) => setFilter(e.target.value)}
							/>

							<div className="col-span-1 flex items-center gap-2">
								<Checkbox
									id="select-all"
									checked={permissions.length === permissionsArray.length}
									onCheckedChange={(checked) =>
										form.setValue(
											'permissions',
											checked ? permissionsArray.map(({ key }) => key) : [],
										)
									}
								/>{' '}
								<Label htmlFor="select-all" className="grow">
									Select all
								</Label>
							</div>
						</div>

						{Object.entries(groupedPermissions).map(([entity, perms]) => {
							const filtered = perms.filter(({ key }) => key.includes(filter))

							if (filtered.length === 0) return null

							return (
								<div key={entity}>
									<h4 className="mt-2 mb-2 text-sm font-semibold capitalize">
										{entity}
									</h4>
									<ul className="grid grid-cols-3 gap-4">
										{filtered.map(({ key }) => (
											<li key={key} className="flex gap-2">
												<Checkbox
													id={key}
													checked={permissions.includes(key)}
													onCheckedChange={(checked) =>
														handleCheckboxChange(key, Boolean(checked))
													}
												/>{' '}
												<Label htmlFor={key}>{key}</Label>
											</li>
										))}
									</ul>
								</div>
							)
						})}
					</div>
				</ScrollArea>
			</FormControl>
			<FormMessage />
		</FormItem>
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