'use client'

import {
	createOrganizationRole,
	updateOrganizationRole,
} from '@/app/actions/organization'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form'
import { permissionsArray } from '@/constants/permissions'
import { Permission } from '@/generated/prisma'
import { stringConcatenator, submitter } from '@/lib/utils'
import {
	newRoleForm,
	NewRoleFormProps,
	updateRoleForm,
	UpdateRoleFormProps,
} from '@/schema/organization'
import { zodResolver } from '@hookform/resolvers/zod'
import { EllipsisVertical, Pencil, Plus } from 'lucide-react'
import { ComponentProps, useMemo } from 'react'
import { useForm, UseFormReturn, WatchObserver } from 'react-hook-form'
import { toast } from 'sonner'
import { Button } from '../../ui/button'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '../../ui/card'
import { Checkbox } from '../../ui/checkbox'
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '../../ui/dialog'
import { Input } from '../../ui/input'
import { ScrollArea, ScrollBar } from '../../ui/scroll-area'
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '../../ui/table'

export function OrganizationRoles({
	cardProps,
	roles,
	readOnly,
}: {
	cardProps: ComponentProps<'div'>
	roles: Array<{
		id: number
		name: string
		users: Array<{ firstName: string | null; lastName: string | null }>
		permissions: Array<{ key: string }>
		_count: {
			users: number
			permissions: number
		}
	}>
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
							? roles.map(({ id, name, users, permissions, _count }, index) => (
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
											<DropdownMenu>
												<DropdownMenuTrigger asChild>
													<Button variant={'ghost'}>
														<EllipsisVertical />
													</Button>
												</DropdownMenuTrigger>
												<DropdownMenuContent
													align="end"
													className="flex w-56 flex-col gap-2"
												>
													<DropdownMenuLabel className="font-bold">
														Manage Role
													</DropdownMenuLabel>
													<DropdownMenuSeparator />
													{id && permissions ? (
														<EditOrganizationRole
															defaultValues={{
																id,
																name: name ?? '',
																permissions: permissions.map(({ key }) => key),
															}}
														/>
													) : null}
												</DropdownMenuContent>
											</DropdownMenu>
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
					Add <Plus />
				</Button>
			</DialogTrigger>
			<DialogContent className="w-fit max-w-none sm:max-w-none">
				<Form {...form}>
					<form onSubmit={onSubmit}>
						<ScrollArea className="h-full max-h-[90vh] pr-3.5">
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
									name="permissions"
									render={() => <PermissionsField form={form} />}
								/>
							</div>
							<DialogFooter className="pb-2">
								<DialogClose asChild>
									<Button variant={'outline'}>Cancel</Button>
								</DialogClose>
								<Button>Create</Button>
							</DialogFooter>
						</ScrollArea>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	)
}

function EditOrganizationRole({
	defaultValues,
}: {
	defaultValues: UpdateRoleFormProps
}) {
	// 1. Define your form.
	const form = useForm<UpdateRoleFormProps>({
		resolver: zodResolver(updateRoleForm),
		defaultValues,
	})

	// 2. Define a submit handler.
	const onSubmit = submitter(
		form,
		async (values: UpdateRoleFormProps) => {
			return await updateOrganizationRole(values)
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
				<button className="hover:bg-accent flex w-full items-center justify-start gap-2 rounded-md px-3.5 py-2 text-sm">
					<Pencil className="size-4" />
					Edit
				</button>
			</DialogTrigger>
			<DialogContent className="w-fit max-w-none sm:max-w-none">
				<Form {...form}>
					<form onSubmit={onSubmit}>
						<DialogHeader>
							<DialogTitle>Update Role</DialogTitle>
							<DialogDescription>
								Update a role for your organization to control the level of
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
								name="permissions"
								render={() => <PermissionsField form={form} />}
							/>
						</div>
						<DialogFooter>
							<DialogClose asChild>
								<Button variant={'outline'}>Cancel</Button>
							</DialogClose>
							<Button>Update</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	)
}

function PermissionsField<
	TFormValues extends { permissions: string[]; name: string[]; id?: number },
>({ form }: { form: UseFormReturn<TFormValues> }) {
	const permissions = form.watch(
		'permissions' as unknown as WatchObserver<TFormValues>,
	)

	const handleCheckboxChange = (key: string, checked: boolean) => {
		const current = new Set(form.getValues('permissions'))
		if (checked) {
			current.add(key)
		} else {
			current.delete(key)
		}
		form.setValue('permissions', Array.from(current))
	}

	// Extract actions and access types dynamically
	const { matrix, actionAccessPairs, entities } = useMemo(() => {
		const matrix: Record<string, Record<string, string>> = {} // entity -> "action:access" -> key

		const actionAccessPairs = new Set<string>()
		const entities = new Set<string>()

		for (const { entity, action, access, key } of permissionsArray) {
			const combo = `${action}:${access}`
			actionAccessPairs.add(combo)
			entities.add(entity)

			if (!matrix[entity]) matrix[entity] = {}
			matrix[entity][combo] = key
		}

		return {
			matrix,
			actionAccessPairs: Array.from(actionAccessPairs).sort(), // Optional: customize sorting
			entities: Array.from(entities),
		}
	}, [])

	return (
		<FormItem>
			<FormLabel>Permissions</FormLabel>
			<FormControl>
				<ScrollArea className="max-w-screen-lg rounded-md pb-4">
					<Table className="w-full border-collapse text-sm">
						<TableHeader>
							<TableRow className="bg-muted text-left">
								<TableHead className="border px-2 py-1">Entity</TableHead>
								{actionAccessPairs.map((pair) => (
									<TableHead
										key={pair}
										className="border px-2 py-1 text-center"
									>
										{pair}
									</TableHead>
								))}
							</TableRow>
						</TableHeader>
						<TableBody>
							{entities.map((entity) => {
								const accessMap = matrix[entity]
								const entityKeys = Object.values(accessMap)
								const isEntityFullySelected = entityKeys.every((key) =>
									permissions.includes(key),
								)

								return (
									<TableRow key={entity}>
										<TableCell className="border px-2 py-1 font-medium capitalize">
											<div className="flex items-center gap-2">
												<Checkbox
													checked={isEntityFullySelected}
													onCheckedChange={(checked) => {
														const current = new Set(
															form.getValues('permissions'),
														)
														for (const key of entityKeys) {
															if (checked) current.add(key)
															else current.delete(key)
														}
														form.setValue('permissions', Array.from(current))
													}}
												/>
												<span>{entity}</span>
											</div>
										</TableCell>

										{actionAccessPairs.map((pair) => {
											const key = accessMap?.[pair]
											return (
												<TableCell
													key={`${entity}-${pair}`}
													className="border px-2 py-1 text-center"
												>
													{key ? (
														<Checkbox
															checked={permissions.includes(key)}
															onCheckedChange={(checked) =>
																handleCheckboxChange(key, Boolean(checked))
															}
														/>
													) : null}
												</TableCell>
											)
										})}
									</TableRow>
								)
							})}
						</TableBody>
					</Table>
					<ScrollBar orientation="horizontal" />
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
	users?: Array<{ firstName: string | null; lastName: string | null }>
	count: number
}) {
	if (!users || users.length < 1) {
		return 'No users'
	}

	let permissionsText = users
		?.map(({ firstName, lastName }) =>
			stringConcatenator([firstName, lastName], ' '),
		)
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

	let permissionsText = permissions
		.slice(0, 2)
		?.map(({ name }) => name)
		.join(', ')

	const additionalPermissionsCount = count - 2
	if (additionalPermissionsCount > 1) {
		permissionsText += ` and ${additionalPermissionsCount} more`
	}

	return permissionsText
}
