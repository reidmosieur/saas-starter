import { ComponentProps } from 'react'
import { FieldProps, LabeledInputField } from '../fields'
import { Path } from 'react-hook-form'

export function StreetOneField<T extends { streetOne: string }>({
	form,
	inputProps,
}: FieldProps<T> & {
	inputProps?: ComponentProps<'input'>
}) {
	return (
		<LabeledInputField
			form={form}
			name={'streetOne' as Path<T>}
			labelProps={{
				children: 'Street',
			}}
			inputProps={inputProps}
		/>
	)
}

export function StreetTwoField<T extends { streetTwo?: string }>({
	form,
	inputProps,
}: FieldProps<T> & {
	inputProps?: ComponentProps<'input'>
}) {
	return (
		<LabeledInputField
			form={form}
			name={'streetTwo' as Path<T>}
			labelProps={{
				children: 'Street Line Two',
			}}
			inputProps={inputProps}
		/>
	)
}

export function CityField<T extends { city: string }>({
	form,
	inputProps,
}: FieldProps<T> & {
	inputProps?: ComponentProps<'input'>
}) {
	return (
		<LabeledInputField
			form={form}
			name={'city' as Path<T>}
			labelProps={{
				children: 'City',
			}}
			inputProps={inputProps}
		/>
	)
}

export function StateField<T extends { state: string }>({
	form,
	inputProps,
}: FieldProps<T> & {
	inputProps?: ComponentProps<'input'>
}) {
	return (
		<LabeledInputField
			form={form}
			name={'state' as Path<T>}
			labelProps={{
				children: 'State',
			}}
			inputProps={inputProps}
		/>
	)
}

export function ZipCodeField<T extends { zipCode: string }>({
	form,
	inputProps = {
		type: 'number',
	},
}: FieldProps<T> & {
	inputProps?: ComponentProps<'input'>
}) {
	return (
		<LabeledInputField
			form={form}
			name={'zipCode' as Path<T>}
			labelProps={{
				children: 'Zip Code',
			}}
			inputProps={inputProps}
		/>
	)
}

export function CountryField<T extends { country: string }>({
	form,
	inputProps,
}: FieldProps<T> & {
	inputProps?: ComponentProps<'input'>
}) {
	return (
		<LabeledInputField
			form={form}
			name={'country' as Path<T>}
			labelProps={{
				children: 'Country',
			}}
			inputProps={inputProps}
		/>
	)
}
