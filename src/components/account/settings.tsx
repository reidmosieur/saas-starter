'use client'

import { Form } from '@/components/ui/form'
import {
	firstNameSchema,
	lastNameSchema,
	phoneNumberSchema,
	usernameSchema,
} from '@/schema/account'
import { emailSchema } from '@/schema/auth'
import { zodResolver } from '@hookform/resolvers/zod'
import { AvatarFallback } from '@radix-ui/react-avatar'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { EmailField } from '../auth/fields'
import { Avatar, AvatarImage } from '../ui/avatar'
import { Button } from '../ui/button'
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '../ui/card'
import { NameField, PhoneNumberField, UsernameField } from './fields'
import { CardFormProps } from '@/types'

const accountSettingsForm = z.object({
	username: usernameSchema,
	firstName: firstNameSchema,
	lastName: lastNameSchema,
})

export function AccountSettingsForm({ cardProps }: CardFormProps) {
	// 1. Define your form.
	const form = useForm<z.infer<typeof accountSettingsForm>>({
		resolver: zodResolver(accountSettingsForm),
		defaultValues: {
			username: '',
		},
	})

	// 2. Define a submit handler.
	function onSubmit(values: z.infer<typeof accountSettingsForm>) {
		// placeholder
		console.log(values)
	}

	return (
		<Form {...form}>
			<Card {...cardProps} asChild>
				<form onSubmit={form.handleSubmit(onSubmit)}>
					<CardHeader>
						<CardTitle>Account</CardTitle>
						<CardDescription>
							Change your name, username, and other information
						</CardDescription>
					</CardHeader>
					<CardContent className="grid gap-4 md:gap-6">
						<NameField form={form} />
						<UsernameField form={form} />
					</CardContent>
					<CardFooter className="mt-auto justify-end">
						<Button loading={form.formState.isSubmitting}>Save</Button>
					</CardFooter>
				</form>
			</Card>
		</Form>
	)
}

const emailSettingsForm = z.object({
	email: emailSchema,
})

export function EmailSettingsForm({ cardProps }: CardFormProps) {
	// 1. Define your form.
	const form = useForm<z.infer<typeof emailSettingsForm>>({
		resolver: zodResolver(emailSettingsForm),
		defaultValues: {
			email: '',
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
						<CardTitle>Email</CardTitle>
						<CardDescription>
							Enter the email addresses you want associated with your account
						</CardDescription>
					</CardHeader>
					<CardContent className="grid gap-4 md:gap-6">
						<EmailField form={form} />
					</CardContent>
					<CardFooter className="mt-auto justify-end">
						<Button loading={form.formState.isSubmitting}>Save</Button>
					</CardFooter>
				</form>
			</Card>
		</Form>
	)
}

const phoneNumberSettingsForm = z.object({
	phoneNumber: phoneNumberSchema,
})

export function PhonenumberSettingsForm({ cardProps }: CardFormProps) {
	// 1. Define your form.
	const form = useForm<z.infer<typeof phoneNumberSettingsForm>>({
		resolver: zodResolver(phoneNumberSettingsForm),
		defaultValues: {
			phoneNumber: '',
		},
	})

	// 2. Define a submit handler.
	function onSubmit(values: z.infer<typeof phoneNumberSettingsForm>) {
		// placeholder
		console.log(values)
	}
	return (
		<Form {...form}>
			<Card {...cardProps} asChild>
				<form onSubmit={form.handleSubmit(onSubmit)}>
					<CardHeader>
						<CardTitle>Your Phone Number</CardTitle>
						<CardDescription>
							Enter your phone number to receive important updates regarding
							your account
						</CardDescription>
					</CardHeader>
					<CardContent className="grid gap-4 md:gap-6">
						<PhoneNumberField form={form} />
					</CardContent>
					<CardFooter className="mt-auto justify-end">
						<Button loading={form.formState.isSubmitting}>Save</Button>
					</CardFooter>
				</form>
			</Card>
		</Form>
	)
}

export function AvatarSettingsForm({ cardProps }: CardFormProps) {
	// 1. Define your form.
	const form = useForm<z.infer<typeof phoneNumberSettingsForm>>({
		resolver: zodResolver(phoneNumberSettingsForm),
		defaultValues: {},
	})

	// 2. Define a submit handler.
	function onSubmit(values: z.infer<typeof phoneNumberSettingsForm>) {
		// placeholder
		console.log(values)
	}
	return (
		<Form {...form}>
			<Card {...cardProps} asChild>
				<form onSubmit={form.handleSubmit(onSubmit)}>
					<CardHeader>
						<CardTitle>Avatar</CardTitle>
						<CardDescription>
							This is your avatar. Click on the avatar to upload a custom one.
						</CardDescription>
					</CardHeader>
					<CardContent className="h-full">
						<Avatar className="h-full w-full">
							<AvatarImage
								className="aspect-square h-full w-full"
								src={'https://placehold.co/600x600/EEE/31343C'}
							/>
							<AvatarFallback>RM</AvatarFallback>
						</Avatar>
					</CardContent>
					<CardFooter className="mt-auto justify-end">
						<Button loading={form.formState.isSubmitting}>Save</Button>
					</CardFooter>
				</form>
			</Card>
		</Form>
	)
}
