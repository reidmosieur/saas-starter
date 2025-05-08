'use client'

import { Form } from '@/components/ui/form'
import { submitter } from '@/lib/utils'
import {
	emailSettingsForm,
	EmailSettingsFormProps,
	personalInfoSettingsForm,
	PersonalInfoSettingsFormProps,
	phoneNumberSettingsForm,
	PhoneNumberSettingsFormProps,
} from '@/schema/account'
import { CardFormProps } from '@/types'
import { zodResolver } from '@hookform/resolvers/zod'
import { AvatarFallback } from '@radix-ui/react-avatar'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
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
import {
	updateEmailSettings,
	updatePersonalInfoSettings,
	updatePhoneNumberSettings,
} from '@/app/actions/account/settings'

export function PersonalInfoSettingsForm({
	cardProps,
	defaultValues = {
		username: '',
	},
}: CardFormProps<PersonalInfoSettingsFormProps>) {
	// 1. Define your form.
	const form = useForm<PersonalInfoSettingsFormProps>({
		resolver: zodResolver(personalInfoSettingsForm),
		defaultValues,
	})

	// 2. Define a submit handler.
	const onSubmit = submitter(
		form,
		async (values: PersonalInfoSettingsFormProps) => {
			return await updatePersonalInfoSettings(values)
		},
		{
			onSuccess: () => {
				toast.success('Successfully updated your personal information settings')
			},
		},
	)

	return (
		<Form {...form}>
			<Card {...cardProps} asChild>
				<form onSubmit={onSubmit}>
					<CardHeader>
						<CardTitle>Personal Information</CardTitle>
						<CardDescription>
							Change your name, username, and other information
						</CardDescription>
					</CardHeader>
					<CardContent className="grid gap-4 md:gap-6">
						<NameField form={form} />
						<UsernameField form={form} />
					</CardContent>
					<CardFooter className="mt-auto justify-end gap-4">
						{form.formState.isDirty ? (
							<Button
								variant={'outline'}
								type="button"
								onClick={() => form.reset()}
							>
								Reset
							</Button>
						) : null}
						<Button loading={form.formState.isSubmitting}>Save</Button>
					</CardFooter>
				</form>
			</Card>
		</Form>
	)
}

export function EmailSettingsForm({
	cardProps,
	defaultValues = {
		email: '',
	},
}: CardFormProps<EmailSettingsFormProps>) {
	// 1. Define your form.
	const form = useForm<EmailSettingsFormProps>({
		resolver: zodResolver(emailSettingsForm),
		defaultValues,
	})

	// 2. Define a submit handler.
	const onSubmit = submitter(
		form,
		async (values: EmailSettingsFormProps) => {
			return await updateEmailSettings(values)
		},
		{
			onSuccess: () => {
				toast.success('Successfully updated your email settings')
			},
		},
	)

	return (
		<Form {...form}>
			<Card {...cardProps} asChild>
				<form onSubmit={onSubmit}>
					<CardHeader>
						<CardTitle>Email</CardTitle>
						<CardDescription>
							Enter the email addresses you want associated with your account
						</CardDescription>
					</CardHeader>
					<CardContent className="grid gap-4 md:gap-6">
						<EmailField form={form} />
					</CardContent>
					<CardFooter className="mt-auto justify-end gap-4">
						{form.formState.isDirty ? (
							<Button
								variant={'outline'}
								type="button"
								onClick={() => form.reset()}
							>
								Reset
							</Button>
						) : null}
						<Button loading={form.formState.isSubmitting}>Save</Button>
					</CardFooter>
				</form>
			</Card>
		</Form>
	)
}

export function PhonenumberSettingsForm({
	cardProps,
	defaultValues = {
		phoneNumber: '',
		countryCode: '',
	},
}: CardFormProps<PhoneNumberSettingsFormProps>) {
	// 1. Define your form.
	const form = useForm<PhoneNumberSettingsFormProps>({
		resolver: zodResolver(phoneNumberSettingsForm),
		defaultValues,
	})

	// 2. Define a submit handler.
	const onSubmit = submitter(
		form,
		async (values: PhoneNumberSettingsFormProps) => {
			return await updatePhoneNumberSettings(values)
		},
		{
			onSuccess: () => {
				toast.success('Successfully updated your phone number settings')
			},
		},
	)
	return (
		<Form {...form}>
			<Card {...cardProps} asChild>
				<form onSubmit={onSubmit}>
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
					<CardFooter className="mt-auto justify-end gap-4">
						{form.formState.isDirty ? (
							<Button
								variant={'outline'}
								type="button"
								onClick={() => form.reset()}
							>
								Reset
							</Button>
						) : null}
						<Button loading={form.formState.isSubmitting}>Save</Button>
					</CardFooter>
				</form>
			</Card>
		</Form>
	)
}

export function AvatarSettingsForm({
	cardProps,
	defaultValues = {
		phoneNumber: '',
		countryCode: '',
	},
}: CardFormProps<PhoneNumberSettingsFormProps>) {
	// 1. Define your form.
	const form = useForm<PhoneNumberSettingsFormProps>({
		resolver: zodResolver(phoneNumberSettingsForm),
		defaultValues,
	})

	// 2. Define a submit handler.
	const onSubmit = submitter(
		form,
		(values: PhoneNumberSettingsFormProps) => {
			// placeholder
			console.log(values)
		},
		{
			onSuccess: () => {
				toast.success('Successfully updated your personal information settings')
			},
		},
	)
	return (
		<Form {...form}>
			<Card {...cardProps} asChild>
				<form onSubmit={onSubmit}>
					<CardHeader>
						<CardTitle>Avatar</CardTitle>
						<CardDescription>
							This is your avatar. Click on the avatar to upload a custom one.
						</CardDescription>
					</CardHeader>
					<CardContent className="h-full">
						<Avatar className="h-full w-full">
							<AvatarImage
								className="aspect-square h-full w-full object-cover"
								src={'/user-images/reid.webp'}
							/>
							<AvatarFallback>RM</AvatarFallback>
						</Avatar>
					</CardContent>
					<CardFooter className="mt-auto justify-end gap-4">
						{form.formState.isDirty ? (
							<Button
								variant={'outline'}
								type="button"
								onClick={() => form.reset()}
							>
								Reset
							</Button>
						) : null}
						<Button loading={form.formState.isSubmitting}>Save</Button>
					</CardFooter>
				</form>
			</Card>
		</Form>
	)
}
