import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { UseFormReturn, FieldValues, Path } from 'react-hook-form'

export type FieldProps<T extends FieldValues> = {
	form: UseFormReturn<T>
}

export function LabeledInputField<T extends FieldValues, K extends Path<T>>({
	form,
	name,
	label,
}: {
	form: UseFormReturn<T>
	name: K
	label: string
}) {
	return (
		<FormField
			control={form.control}
			name={name}
			render={({ field }) => (
				<FormItem>
					<FormLabel>{label}</FormLabel>
					<FormControl>
						<Input {...field} />
					</FormControl>
					<FormMessage />
				</FormItem>
			)}
		/>
	)
}
