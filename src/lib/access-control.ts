'use server'
import { getUserFromSession } from '@/app/actions/user'
import { routePermissions } from '@/constants/routes'
import { defaultUserSelect } from '@/constants/user'
import { Prisma } from '@/generated/prisma'
import { constructPermissionKey } from './utils'

interface GetUserPermissionsArgs {
	additionalSelect?: Prisma.UserSelect
}

export async function getUserPermissions({
	additionalSelect = defaultUserSelect,
}: GetUserPermissionsArgs) {
	const select: Prisma.UserSelect = {
		...additionalSelect,
		roles: {
			select: {
				permissions: {
					select: {
						action: true,
						entity: true,
						access: true,
					},
				},
			},
		},
	}

	const user = await getUserFromSession(select)

	const permissionsArray = user?.roles.flatMap(({ permissions }) =>
		permissions.flatMap(({ action, entity, access }) =>
			constructPermissionKey({ action, entity, access }),
		),
	)
	const permissions = new Set(permissionsArray)

	return { permissions, user }
}

interface CheckUserPermissionsArgs extends GetUserPermissionsArgs {
	requiredPermissions: Array<string>
}

export async function checkUserPermissions({
	additionalSelect,
	requiredPermissions,
}: CheckUserPermissionsArgs) {
	const { user, permissions } = await getUserPermissions({ additionalSelect })

	const missingPermissions = requiredPermissions.filter(
		(permission) => !permissions?.has(permission),
	)

	if (missingPermissions.length > 0) {
		return {
			permitted: false,
			user: null,
			permissions: null,
		}
	}

	return {
		permitted: true,
		user,
		permissions,
	}
}

export async function constructNavigation() {
	const userPermissions = await getUserPermissions({
		additionalSelect: undefined,
	})

	const permittedRoutes = routePermissions
		.filter(({ permissions }) =>
			permissions.some((permission) => {
				return userPermissions.permissions.has(permission)
			}),
		)
		.map(({ route }) => route)

	return permittedRoutes
}
