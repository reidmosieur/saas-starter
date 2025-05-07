'use client'

import { Path } from 'react-hook-form'
import { FieldProps, LabeledInputField } from '../fields'
import { ComponentProps } from 'react'

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
