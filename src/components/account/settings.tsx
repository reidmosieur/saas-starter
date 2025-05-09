'use client'

import {
	updateEmailSettings,
	updatePersonalInfoSettings,
	updatePhoneNumberSettings,
	uploadAvatar,
} from '@/app/actions/account/settings'
import { Form, FormMessage } from '@/components/ui/form'
import { cn, getImageDimensions, submitter } from '@/lib/utils'
import {
	avatarSettingsForm,
	AvatarSettingsFormProps,
	emailSettingsForm,
	EmailSettingsFormProps,
	personalInfoSettingsForm,
	PersonalInfoSettingsFormProps,
	phoneNumberSettingsForm,
	PhoneNumberSettingsFormProps,
} from '@/schema/account'
import { CardFormProps } from '@/types'
import { zodResolver } from '@hookform/resolvers/zod'
import { Upload } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
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
	const disabled = !form.formState.isDirty

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
						<Button loading={form.formState.isSubmitting} disabled={disabled}>
							Save
						</Button>
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
	const disabled = !form.formState.isDirty

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
						<Button loading={form.formState.isSubmitting} disabled={disabled}>
							Save
						</Button>
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
	const disabled = !form.formState.isDirty

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
						<Button loading={form.formState.isSubmitting} disabled={disabled}>
							Save
						</Button>
					</CardFooter>
				</form>
			</Card>
		</Form>
	)
}

export function AvatarSettingsForm({
	cardProps,
	defaultValues = {
		height: '',
		width: '',
	},
	currentImage,
}: CardFormProps<AvatarSettingsFormProps> & {
	currentImage?: string
}) {
	const [preview, setPreview] = useState<string | undefined>(currentImage)
	const inputRef = useRef<HTMLInputElement>(null)

	const form = useForm<AvatarSettingsFormProps>({
		resolver: zodResolver(avatarSettingsForm),
		defaultValues,
	})
	const disabled = !form.formState.isDirty

	const watchFile = form.watch('avatar')

	// Update preview when file changes
	useEffect(() => {
		if (watchFile instanceof File) {
			const fileReader = new FileReader()
			fileReader.onload = () => {
				setPreview(fileReader.result as string)
			}
			fileReader.readAsDataURL(watchFile)
		}
	}, [watchFile])

	const onSubmit = submitter(
		form,
		async (values: AvatarSettingsFormProps) => {
			const avatar = values.avatar
			const formData = new FormData()
			formData.append('avatar', avatar)

			const { width, height } = await getImageDimensions(avatar)
			formData.append('width', width.toString())
			formData.append('height', height.toString())

			return await uploadAvatar(formData)
		},
		{
			onSuccess: () => {
				toast.success('Successfully updated your avatar settings')
			},
		},
	)

	const onReset = () => {
		form.reset()
		setPreview(currentImage)
	}

	return (
		<Form {...form}>
			<Card {...cardProps} asChild>
				<form onSubmit={onSubmit} encType="multipart/form-data">
					<CardHeader>
						<CardTitle>Avatar</CardTitle>
						<CardDescription>
							This is your avatar. Click on the avatar to upload a custom one.
						</CardDescription>
					</CardHeader>
					<CardContent className="grid h-full">
						<label
							htmlFor="avatar"
							className={cn(
								'min-h-full min-w-full cursor-pointer',
								!preview &&
									'bg-muted text-muted-foreground border-muted-foreground inline-flex flex-col items-center justify-center rounded-xl border-2 border-dashed',
							)}
						>
							{preview ? (
								<Avatar className="h-full w-full">
									<AvatarImage
										className="aspect-square h-full w-full object-cover"
										src={preview}
										alt="Your avatar"
									/>
								</Avatar>
							) : (
								<>
									<Upload className="size-8" />
									<span>Upload an image</span>
								</>
							)}
						</label>
						<input
							ref={inputRef}
							hidden
							id="avatar"
							type="file"
							accept="image/png"
							onChange={(e) => {
								if (e.target.files?.[0]) {
									form.setValue('avatar', e.target.files[0], {
										shouldValidate: true,
										shouldDirty: true,
									})
								}
							}}
						/>
						{form.formState.errors.root ? (
							<FormMessage>{form.formState.errors.root.message}</FormMessage>
						) : null}
						{form.formState.errors.avatar ? (
							<FormMessage>{form.formState.errors.avatar.message}</FormMessage>
						) : null}
						{form.formState.errors.height ? (
							<FormMessage>{form.formState.errors.height.message}</FormMessage>
						) : null}
						{form.formState.errors.width ? (
							<FormMessage>{form.formState.errors.width.message}</FormMessage>
						) : null}
					</CardContent>
					<CardFooter className="mt-auto justify-end gap-4">
						{form.formState.isDirty ? (
							<Button variant="outline" type="button" onClick={onReset}>
								Reset
							</Button>
						) : null}
						<Button loading={form.formState.isSubmitting} disabled={disabled}>
							Save
						</Button>
					</CardFooter>
				</form>
			</Card>
		</Form>
	)
}
