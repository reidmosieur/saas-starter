'use client'

import { Path } from 'react-hook-form'
import { FieldProps, LabeledInputField } from '../fields'
import { ComponentProps } from 'react'
import {
	Select,
	SelectValue,
	SelectTrigger,
	SelectItem,
	SelectContent,
} from '../ui/select'
import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '../ui/form'

export function OrganizationNameField<T extends { name: string }>({
	form,
	inputProps,
}: FieldProps<T> & {
	inputProps?: ComponentProps<'input'>
}) {
	return (
		<LabeledInputField
			form={form}
			name={'name' as Path<T>}
			labelProps={{ children: 'Organization Name' }}
			inputProps={inputProps}
		/>
	)
}

export function SelectRoleField<T extends { role: string }>({
	form,
	options,
}: FieldProps<T> & {
	options: Array<{ label: string; value: string }>
}) {
	return (
		<FormField
			control={form.control}
			name={'role' as Path<T>}
			render={({ field }) => (
				<FormItem>
					<FormLabel>Role</FormLabel>
					<Select
						onValueChange={field.onChange}
						defaultValue={field.value}
						value={field.value}
					>
						<FormControl>
							<SelectTrigger className="w-full">
								<SelectValue />
							</SelectTrigger>
						</FormControl>
						<SelectContent>
							{options.map(({ label, value }) => (
								<SelectItem key={value} value={value}>
									{label}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
					<FormMessage />
				</FormItem>
			)}
		/>
	)
}