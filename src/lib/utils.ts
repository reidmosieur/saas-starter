import { clsx, type ClassValue } from 'clsx'
import { ErrorOption, FieldValues, Path, UseFormReturn } from 'react-hook-form'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

export function submitter<T extends FieldValues>(
	form: UseFormReturn<T>,
	action: (values: T) => Promise<
		| {
				errors?: Record<string, ErrorOption | string | string[]>
		  }
		| undefined
	> | void,
	options?: {
		onSuccess?: () => void | Promise<void>
	},
) {
	return form.handleSubmit(async (values: T) => {
		const result = await action(values)

		if (!result || !result.errors) {
			await options?.onSuccess?.()
			return
		}

		Object.entries(result.errors).forEach(([key, value]) => {
			// If the error is at the root level (not field-specific)
			if (key === 'root') {
				const rootMessage =
					typeof value === 'string'
						? value
						: Array.isArray(value)
							? value.join(', ')
							: value?.message

				if (rootMessage) {
					form.setError('root', {
						type: 'manual',
						message: rootMessage,
					})
				}
				return
			}

			const field = key as Path<T>

			if (Array.isArray(value)) {
				value.forEach((error) =>
					form.setError(field, {
						message: typeof error === 'string' ? error : '',
						type: 'manual',
					}),
				)
			} else if (typeof value === 'object' && 'message' in value) {
				form.setError(field, { message: value.message, type: 'manual' })
			} else if (typeof value === 'string') {
				form.setError(field, { message: value, type: 'manual' })
			}
		})
	})
}

export function getImageDimensions(
	file: File,
): Promise<{ width: number; height: number }> {
	return new Promise((resolve, reject) => {
		const img = new Image()
		img.onload = () => {
			resolve({ width: img.width, height: img.height })
		}
		img.onerror = reject

		img.src = URL.createObjectURL(file)
	})
}
