import { ComponentProps } from 'react'
import { DefaultValues, FieldValues } from 'react-hook-form'

export interface CardFormProps<T extends FieldValues> {
	cardProps?: ComponentProps<'div'>
	defaultValues?: DefaultValues<T>
}
