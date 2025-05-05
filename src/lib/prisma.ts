import { Prisma, PrismaClient } from '@/generated/prisma'

const globalForPrisma = global as unknown as {
	prisma: PrismaClient
}

const prisma =
	globalForPrisma.prisma ||
	new PrismaClient().$extends({
		model: {
			$allModels: {
				// source: https://github.com/prisma/prisma-client-extensions/blob/main/exists-fn/script.ts
				async exists<T>(
					this: T,
					where: Prisma.Args<T, 'findFirst'>['where'],
				): Promise<boolean> {
					const context = Prisma.getExtensionContext(this)
					// eslint-disable-next-line @typescript-eslint/no-explicit-any
					const result = await (context as any).findFirst({
						where,
						select: { id: true },
					})
					return result !== null
				},
			},
		},
	})

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export default prisma
