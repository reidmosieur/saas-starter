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
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { Button } from '../../ui/button'
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '../../ui/card'
import { OrganizationNameField } from '../fields'

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
