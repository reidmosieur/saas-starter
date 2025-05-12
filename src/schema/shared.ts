import { z } from 'zod'

export const firstNameSchema = z
	.string()
	.min(2, { message: `Please provide a first name` })
	.trim()
export const lastNameSchema = z
	.string()
	.min(2, { message: `Please provide a last name` })
	.trim()
export const organizationNameSchema = z
	.string()
	.min(2, 'Please provide an organization name')
