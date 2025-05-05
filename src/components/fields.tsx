import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { LabelProps } from '@radix-ui/react-label'
import { ComponentProps, ForwardRefExoticComponent, RefAttributes } from 'react'
import { FieldValues, Path, UseFormReturn } from 'react-hook-form'

export type FieldProps<T extends FieldValues> = {
	form: UseFormReturn<T>
}

export function LabeledInputField<T extends FieldValues, K extends Path<T>>({
	form,
	name,
	labelProps,
	inputProps,
}: {
	form: UseFormReturn<T>
	name: K
	labelProps?: ComponentProps<
		ForwardRefExoticComponent<LabelProps & RefAttributes<HTMLLabelElement>>
	>
	inputProps?: ComponentProps<'input'>
}) {
	return (
		<FormField
			control={form.control}
			name={name}
			render={({ field }) => (
				<FormItem>
					<FormLabel {...labelProps} />
					<FormControl>
						<Input {...field} {...inputProps} />
					</FormControl>
					<FormMessage />
				</FormItem>
			)}
		/>
	)
}
