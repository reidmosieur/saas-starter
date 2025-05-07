import { z } from 'zod'

export const organizationSchema = z
	.string()
	.min(2, 'Please provide an organization name')
