import { onboardingSteps } from '@/constants/onboarding'
import { PermissionKey } from '@/constants/permissions'
import { OnboardingSteps } from '@/generated/prisma'
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
		onSuccess?: (values: T) => void | Promise<void>
	},
) {
	return form.handleSubmit(async (values: T) => {
		const result = await action(values)

		if (!result || !result.errors) {
			await options?.onSuccess?.(values)
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

export function capitalize(str: string) {
	return str.at(0)?.toUpperCase() + str.slice(1)
}

export function constructPermissionKey({
	action,
	access,
	entity,
}: {
	action: string
	access: string
	entity: string
}) {
	return [action, access, entity].join(':')
}

export function constructRequiredPermissions(
	sourcePermissions: Array<{
		key: PermissionKey
		action: string
		access: string
		entity: string
	}>,
) {
	return sourcePermissions.map(({ key }) => key)
}

export type StringPart =
	| string
	| null
	| undefined
	| {
			parts: StringPart[]
			join: string
	  }

export function stringConcatenator(
	words: Array<string | undefined | null>,
	join: string,
) {
	return words.filter(Boolean).join(join)
}

export function smartConcat(parts: StringPart[]): string {
	return stringConcatenator(
		parts.map((part) => {
			if (
				typeof part === 'object' &&
				part !== null &&
				'parts' in part &&
				'join' in part
			) {
				return smartConcat(part.parts)
			}
			return part ?? ''
		}),
		' ',
	)
}

export function getCurrentOnboardingSlug(currentStep: OnboardingSteps) {
	return onboardingSteps.find(({ id }) => id === currentStep)?.slug
}
