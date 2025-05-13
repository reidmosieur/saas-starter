'use client'

import {
	reactivateUser,
	sendOrganizationInvitation,
	suspendUser,
	updateOrganizationUser,
} from '@/app/actions/organization'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Form, FormMessage } from '@/components/ui/form'
import { User } from '@/generated/prisma'
import { cn, stringConcatenator, submitter } from '@/lib/utils'
import {
	inviteUserForm,
	InviteUserFormProps,
	reactivateUserForm,
	ReactivateUserFormProps,
	suspendUserForm,
	SuspendUserFormProps,
	updateOrganizationUserForm,
	UpdateOrganizationUserForm,
} from '@/schema/organization'
import { zodResolver } from '@hookform/resolvers/zod'
import { EllipsisVertical, Pencil, UserPlus, UserX } from 'lucide-react'
import { ComponentProps } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { NameField } from '../../account/fields'
import { EmailField } from '../../auth/fields'
import { Button } from '../../ui/button'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '../../ui/card'
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
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '../../ui/table'
import { SelectRoleField } from '../fields'

export function OrganizationUsers({
	cardProps,
	users,
	roles,
	readOnly,
	availableUserCredits = 5, // to do: add user credits to organization and context
}: {
	cardProps: ComponentProps<'div'>
	users: Array<
		Partial<
			User & {
				roles: Array<{ name: string; id: number }>
			}
		>
	>
	roles: Array<{ name: string; id: number }>
	readOnly: boolean
	availableUserCredits?: number
}) {
	const UserRow = ({
		id,
		firstName,
		lastName,
		email,
		onboarded,
		invitedAt,
		suspended,
		userRoles,
	}: {
		id: number | undefined
		firstName: string | null | undefined
		lastName: string | null | undefined
		email: string | undefined
		onboarded: Date | null | undefined
		invitedAt: Date | null | undefined
		suspended: Date | null | undefined
		userRoles?:
			| {
					name: string
					id: number
			  }[]
			| undefined
	}) => {
		const name = stringConcatenator([firstName, lastName], ' ')
		return (
			<TableRow>
				<TableCell>{email}</TableCell>
				<TableCell>
					{firstName} {lastName}
				</TableCell>
				<TableCell>{userRoles?.map(({ name }) => name).join(', ')}</TableCell>
				<TableCell
					className={cn(
						suspended && 'text-destructive',
						onboarded && !suspended && 'text-green-700 dark:text-green-400',
						invitedAt && !suspended && 'text-muted-foreground',
					)}
				>
					{suspended ? (
						<span>Suspended on {new Date(suspended).toLocaleDateString()}</span>
					) : onboarded ? (
						<span>Active since {new Date(onboarded).toLocaleDateString()}</span>
					) : invitedAt ? (
						<span>Invited on {new Date(invitedAt).toLocaleDateString()}</span>
					) : null}
				</TableCell>
				<TableCell align="right">
					{suspended && id ? (
						<ReactivateUser
							id={id}
							name={name}
							availableUserCredits={availableUserCredits}
						/>
					) : id ? (
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
									Manage User
								</DropdownMenuLabel>
								<DropdownMenuSeparator />
								<EditUser
									roles={roles}
									defaultValues={{
										id: id,
										firstName: firstName ?? '',
										lastName: lastName ?? '',
										role: userRoles?.at(0)?.id?.toString() ?? '',
									}}
								/>
								<SuspendUser name={name} email={email ?? ''} />
							</DropdownMenuContent>
						</DropdownMenu>
					) : null}
				</TableCell>
			</TableRow>
		)
	}

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
				{readOnly ? null : (
					<InviteUser
						roles={roles}
						availableUserCredits={availableUserCredits}
					/>
				)}
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
											id,
											firstName,
											lastName,
											email,
											onboarded,
											invitedAt,
											suspended,
											roles: userRoles,
										},
										index,
									) => (
										<UserRow
											key={index}
											id={id}
											firstName={firstName}
											lastName={lastName}
											email={email}
											onboarded={onboarded}
											invitedAt={invitedAt}
											suspended={suspended}
											userRoles={userRoles}
										/>
									),
								)
							: null}
					</TableBody>
				</Table>
			</CardContent>
		</Card>
	)
}

function InviteUser({
	roles,
	availableUserCredits,
}: {
	roles: Array<{ name: string; id: number }>
	availableUserCredits?: number
}) {
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
				<Button
					variant={'outline'}
					size={'sm'}
					disabled={
						typeof availableUserCredits === 'undefined' ||
						availableUserCredits < 1
					}
				>
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
									label: name + id,
									value: id.toString(),
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

function EditUser({
	roles,
	defaultValues,
}: {
	roles: Array<{ name: string; id: number }>
	defaultValues: UpdateOrganizationUserForm
}) {
	// 1. Define your form.
	const form = useForm<UpdateOrganizationUserForm>({
		resolver: zodResolver(updateOrganizationUserForm),
		defaultValues,
	})

	// 2. Define a submit handler.
	const onSubmit = submitter(
		form,
		async (values: UpdateOrganizationUserForm) => {
			return await updateOrganizationUser(values)
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
			<DialogContent>
				<Form {...form}>
					<form onSubmit={onSubmit}>
						<DialogHeader>
							<DialogTitle>Edit this user</DialogTitle>
							<DialogDescription>
								Edit the user you are trying to edit.
							</DialogDescription>
						</DialogHeader>
						<div className="space-y-8 py-4">
							<NameField form={form} />
							<SelectRoleField
								form={form}
								options={roles.map(({ name, id }) => ({
									label: name,
									value: id.toString(),
								}))}
							/>
							{form.formState.errors.root ? (
								<FormMessage>{form.formState.errors.root.message}</FormMessage>
							) : null}
						</div>
						<DialogFooter>
							<DialogClose asChild>
								<Button variant={'outline'}>Cancel</Button>
							</DialogClose>
							<Button type="submit">Save</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	)
}

function ReactivateUser({
	id,
	name,
	availableUserCredits,
}: {
	id: number
	name: string
	availableUserCredits?: number
}) {
	// 1. Define your form.
	const form = useForm<ReactivateUserFormProps>({
		resolver: zodResolver(reactivateUserForm),
		defaultValues: {
			id,
		},
	})

	// 2. Define a submit handler.
	const onSubmit = submitter(
		form,
		async (values: ReactivateUserFormProps) => {
			return await reactivateUser(values)
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
				<Button
					size={'sm'}
					disabled={
						typeof availableUserCredits === 'undefined' ||
						availableUserCredits < 1
					}
				>
					Reactivate
				</Button>
			</DialogTrigger>
			<DialogContent>
				<Form {...form}>
					<form onSubmit={onSubmit}>
						<DialogHeader>
							<DialogTitle>Reactivate {name}?</DialogTitle>
							<DialogDescription>
								Are you sure you want to suspend this user? They won&apos;t be
								able to access the application anymore.
							</DialogDescription>
						</DialogHeader>
						<DialogFooter>
							<DialogClose asChild>
								<Button variant={'outline'}>Cancel</Button>
							</DialogClose>
							<Button type="submit">Yes, reactivate {name}</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	)
}

function SuspendUser({ name, email }: { name: string; email: string }) {
	// 1. Define your form.
	const form = useForm<SuspendUserFormProps>({
		resolver: zodResolver(suspendUserForm),
		defaultValues: {
			confirmEmail: email,
		},
	})

	// 2. Define a submit handler.
	const onSubmit = submitter(
		form,
		async (values: SuspendUserFormProps) => {
			return await suspendUser(values)
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
					<UserX className="size-4" /> Suspend
				</button>
			</DialogTrigger>
			<DialogContent>
				<Form {...form}>
					<form onSubmit={onSubmit}>
						<DialogHeader>
							<DialogTitle>Suspend {name}?</DialogTitle>
							<DialogDescription>
								Are you sure you want to suspend this user? They won&apos;t be
								able to access the application anymore.
							</DialogDescription>
						</DialogHeader>
						<div className="space-y-8 py-4">
							<EmailField
								form={form}
								inputProps={{ placeholder: `Type ${email} to confirm` }}
							/>
							{form.formState.errors.root ? (
								<FormMessage>{form.formState.errors.root.message}</FormMessage>
							) : null}
						</div>
						<DialogFooter>
							<DialogClose asChild>
								<Button variant={'outline'}>Cancel</Button>
							</DialogClose>
							<Button type="submit" variant={'destructive'}>
								Yes, suspend {name}
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	)
}
