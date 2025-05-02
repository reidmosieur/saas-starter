import { z } from 'zod'

export const passwordSchema = z.string().min(8)

export const emailSchema = z.string().email()
