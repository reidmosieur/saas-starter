import { PrismaClient } from '@/generated/prisma'
import { capitalize } from '@/lib/utils'
import { writeFileSync } from 'fs'
import path from 'path'

const prisma = new PrismaClient()

async function main() {
	const permissions = await prisma.permission.findMany({
		select: {
			access: true,
			action: true,
			entity: true,
		},
	})
	const allAccess = new Set<string>()
	const allActions = new Set<string>()
	const allEntity = new Set<string>()
	const allPermission: {
		name: string
		key: string
		action: string
		access: string
		entity: string
	}[] = []

	permissions.map(({ action, access, entity }) => {
		allAccess.add(access)
		allActions.add(action)
		allEntity.add(entity)

		const key = [action, access, entity].join(':')
		const name = `${action}${capitalize(access)}${capitalize(entity)}`
		allPermission.push({ name, key, action, access, entity })
	})

	const toUnion = (s: Set<string>) =>
		[...s].map((val) => `'${val}'`).join(' | ')

	const permissionTypes = `
export type Permission = {
	action: ${toUnion(allActions)}
	entity: ${toUnion(allEntity)}
	access: ${toUnion(allAccess)}
}
`.trim()

	const constants = allPermission
		.map(
			(p) => `
export const ${p.name} = {
	key: '${p.key}',
	action: '${p.action}',
	access: '${p.access}',
	entity: '${p.entity}',
} as const`,
		)
		.join('\n')

	const permissionsObject = `
export const Permissions = {
	${allPermission.map((p) => p.name).join(',\n\t')},
} as const
`.trim()

	const permissionKeyType = `
export type PermissionKey =
	(typeof Permissions)[keyof typeof Permissions]['key']
`.trim()

	const output = [
		permissionTypes,
		constants,
		permissionsObject,
		permissionKeyType,
	].join('\n\n')

	writeFileSync(path.join(__dirname, 'permissions.ts'), output)
	console.log('✅ permissions.ts generated.')
}

main()
	.catch((e) => {
		console.error(e)
		process.exit(1)
	})
	.finally(() => prisma.$disconnect())
