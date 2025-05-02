'use client'

import { Form } from '@/components/ui/form'
import {
	firstNameSchema,
	lastNameSchema,
	usernameSchema,
} from '@/schema/account'
import { CardFormProps } from '@/types'
import { zodResolver } from '@hookform/resolvers/zod'
import { EllipsisVertical, UserPlus } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
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

const organizationSettingsForm = z.object({
	username: usernameSchema,
	firstName: firstNameSchema,
	lastName: lastNameSchema,
})

export function OrganizationSettingsForm({ cardProps }: CardFormProps) {
	// 1. Define your form.
	const form = useForm<z.infer<typeof organizationSettingsForm>>({
		resolver: zodResolver(organizationSettingsForm),
		defaultValues: {
			username: '',
		},
	})

	// 2. Define a submit handler.
	function onSubmit(values: z.infer<typeof organizationSettingsForm>) {
		// placeholder
		console.log(values)
	}

	return (
		<Form {...form}>
			<Card {...cardProps} asChild>
				<form onSubmit={form.handleSubmit(onSubmit)}>
					<CardHeader>
						<CardTitle>General</CardTitle>
						<CardDescription>Change your organizations name</CardDescription>
					</CardHeader>
					<CardContent className="grid gap-4 md:gap-6"></CardContent>
					<CardFooter className="mt-auto justify-end">
						<Button>Save</Button>
					</CardFooter>
				</form>
			</Card>
		</Form>
	)
}

export function OrganizationUsers({ cardProps }: CardFormProps) {
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
							<TableHead>Role</TableHead>
							<TableHead>Status</TableHead>
							<TableHead />
						</TableRow>
					</TableHeader>
					<TableBody>
						<TableRow>
							<TableCell>joe@example.com</TableCell>
							<TableCell>Joe Dirt</TableCell>
							<TableCell>Admin</TableCell>
							<TableCell className="text-green-700 dark:text-green-300">
								Active since 4/01/25
							</TableCell>
							<TableCell>
								<Popover>
									<PopoverTrigger asChild>
										<Button variant={'ghost'}>
											<EllipsisVertical />
										</Button>
									</PopoverTrigger>
									<PopoverContent align="end" className="flex flex-col gap-2">
										<Button variant={'outline'}>Edit</Button>
										<Button variant={'outline'}>Deactivate</Button>
										<Button variant={'destructive'}>Delete</Button>
									</PopoverContent>
								</Popover>
							</TableCell>
						</TableRow>
						<TableRow>
							<TableCell>jane@example.com</TableCell>
							<TableCell>Jane Dirt</TableCell>
							<TableCell>User</TableCell>
							<TableCell className="text-muted-foreground">
								Inactive since 4/14/25
							</TableCell>
							<TableCell>
								<Popover>
									<PopoverTrigger asChild>
										<Button variant={'ghost'}>
											<EllipsisVertical />
										</Button>
									</PopoverTrigger>
									<PopoverContent align="end" className="flex flex-col gap-2">
										<Button>Reactivate</Button>
										<Button variant={'destructive'}>Delete</Button>
									</PopoverContent>
								</Popover>
							</TableCell>
						</TableRow>
						<TableRow>
							<TableCell>bob@example.com</TableCell>
							<TableCell>Bob Dirt</TableCell>
							<TableCell />
							<TableCell className="text-muted-foreground">
								Invited since 4/14/25
							</TableCell>
							<TableCell>
								<Popover>
									<PopoverTrigger asChild>
										<Button variant={'ghost'}>
											<EllipsisVertical />
										</Button>
									</PopoverTrigger>
									<PopoverContent align="end" className="flex flex-col gap-2">
										<Button variant={'destructive'}>Rescind Invitation</Button>
									</PopoverContent>
								</Popover>
							</TableCell>
						</TableRow>
					</TableBody>
				</Table>
			</CardContent>
		</Card>
	)
}

export function OrganizationRoles({ cardProps }: CardFormProps) {
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
						<TableRow>
							<TableCell>Admin</TableCell>
							<TableCell>Joe Dirt and 0 others</TableCell>
							<TableCell>Create any, invite users, and 5 others</TableCell>
							<TableCell>
								<Popover>
									<PopoverTrigger asChild>
										<Button variant={'ghost'}>
											<EllipsisVertical />
										</Button>
									</PopoverTrigger>
									<PopoverContent align="end" className="flex flex-col gap-2">
										<Button variant={'outline'}>Edit</Button>
										<Button variant={'destructive'}>Delete</Button>
									</PopoverContent>
								</Popover>
							</TableCell>
						</TableRow>
						<TableRow>
							<TableCell>User</TableCell>
							<TableCell>Jane Dirt and 0 others</TableCell>
							<TableCell>Create own, read own, and 5 others</TableCell>
							<TableCell>
								<Popover>
									<PopoverTrigger asChild>
										<Button variant={'ghost'}>
											<EllipsisVertical />
										</Button>
									</PopoverTrigger>
									<PopoverContent align="end" className="flex flex-col gap-2">
										<Button variant={'outline'}>Edit</Button>
										<Button variant={'destructive'}>Delete</Button>
									</PopoverContent>
								</Popover>
							</TableCell>
						</TableRow>
					</TableBody>
				</Table>
			</CardContent>
		</Card>
	)
}
