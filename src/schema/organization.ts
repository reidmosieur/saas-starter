import { z } from 'zod'

export const organizationNameSchema = z
	.string()
	.min(2, 'Please provide an organization name')

export const organizationInfoSettingsForm = z.object({
	name: organizationNameSchema,
})
export type OrganizationInfoSettingsFormProps = z.infer<
	typeof organizationInfoSettingsForm
>
