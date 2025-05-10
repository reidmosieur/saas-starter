export type Permission = {
	action: 'read' | 'create' | 'update' | 'delete'
	entity: 'dashboard' | 'user' | 'organization' | 'avatar' | 'role'
	access: 'granted' | 'own' | 'organization'
}

export const readGrantedDashboard = {
	key: 'read:granted:dashboard',
	action: 'read',
	access: 'granted',
	entity: 'dashboard',
} as const

export const createOwnUser = {
	key: 'create:own:user',
	action: 'create',
	access: 'own',
	entity: 'user',
} as const

export const createOwnOrganization = {
	key: 'create:own:organization',
	action: 'create',
	access: 'own',
	entity: 'organization',
} as const

export const createOwnAvatar = {
	key: 'create:own:avatar',
	action: 'create',
	access: 'own',
	entity: 'avatar',
} as const

export const createOwnRole = {
	key: 'create:own:role',
	action: 'create',
	access: 'own',
	entity: 'role',
} as const

export const createOrganizationUser = {
	key: 'create:organization:user',
	action: 'create',
	access: 'organization',
	entity: 'user',
} as const

export const createOrganizationOrganization = {
	key: 'create:organization:organization',
	action: 'create',
	access: 'organization',
	entity: 'organization',
} as const

export const createOrganizationAvatar = {
	key: 'create:organization:avatar',
	action: 'create',
	access: 'organization',
	entity: 'avatar',
} as const

export const createOrganizationRole = {
	key: 'create:organization:role',
	action: 'create',
	access: 'organization',
	entity: 'role',
} as const

export const readOwnUser = {
	key: 'read:own:user',
	action: 'read',
	access: 'own',
	entity: 'user',
} as const

export const readOwnOrganization = {
	key: 'read:own:organization',
	action: 'read',
	access: 'own',
	entity: 'organization',
} as const

export const readOwnAvatar = {
	key: 'read:own:avatar',
	action: 'read',
	access: 'own',
	entity: 'avatar',
} as const

export const readOwnRole = {
	key: 'read:own:role',
	action: 'read',
	access: 'own',
	entity: 'role',
} as const

export const readOrganizationUser = {
	key: 'read:organization:user',
	action: 'read',
	access: 'organization',
	entity: 'user',
} as const

export const readOrganizationOrganization = {
	key: 'read:organization:organization',
	action: 'read',
	access: 'organization',
	entity: 'organization',
} as const

export const readOrganizationAvatar = {
	key: 'read:organization:avatar',
	action: 'read',
	access: 'organization',
	entity: 'avatar',
} as const

export const readOrganizationRole = {
	key: 'read:organization:role',
	action: 'read',
	access: 'organization',
	entity: 'role',
} as const

export const updateOwnUser = {
	key: 'update:own:user',
	action: 'update',
	access: 'own',
	entity: 'user',
} as const

export const updateOwnOrganization = {
	key: 'update:own:organization',
	action: 'update',
	access: 'own',
	entity: 'organization',
} as const

export const updateOwnAvatar = {
	key: 'update:own:avatar',
	action: 'update',
	access: 'own',
	entity: 'avatar',
} as const

export const updateOwnRole = {
	key: 'update:own:role',
	action: 'update',
	access: 'own',
	entity: 'role',
} as const

export const updateOrganizationUser = {
	key: 'update:organization:user',
	action: 'update',
	access: 'organization',
	entity: 'user',
} as const

export const updateOrganizationOrganization = {
	key: 'update:organization:organization',
	action: 'update',
	access: 'organization',
	entity: 'organization',
} as const

export const updateOrganizationAvatar = {
	key: 'update:organization:avatar',
	action: 'update',
	access: 'organization',
	entity: 'avatar',
} as const

export const updateOrganizationRole = {
	key: 'update:organization:role',
	action: 'update',
	access: 'organization',
	entity: 'role',
} as const

export const deleteOwnUser = {
	key: 'delete:own:user',
	action: 'delete',
	access: 'own',
	entity: 'user',
} as const

export const deleteOwnOrganization = {
	key: 'delete:own:organization',
	action: 'delete',
	access: 'own',
	entity: 'organization',
} as const

export const deleteOwnAvatar = {
	key: 'delete:own:avatar',
	action: 'delete',
	access: 'own',
	entity: 'avatar',
} as const

export const deleteOwnRole = {
	key: 'delete:own:role',
	action: 'delete',
	access: 'own',
	entity: 'role',
} as const

export const deleteOrganizationUser = {
	key: 'delete:organization:user',
	action: 'delete',
	access: 'organization',
	entity: 'user',
} as const

export const deleteOrganizationOrganization = {
	key: 'delete:organization:organization',
	action: 'delete',
	access: 'organization',
	entity: 'organization',
} as const

export const deleteOrganizationAvatar = {
	key: 'delete:organization:avatar',
	action: 'delete',
	access: 'organization',
	entity: 'avatar',
} as const

export const deleteOrganizationRole = {
	key: 'delete:organization:role',
	action: 'delete',
	access: 'organization',
	entity: 'role',
} as const

export const Permissions = {
	readGrantedDashboard,
	createOwnUser,
	createOwnOrganization,
	createOwnAvatar,
	createOwnRole,
	createOrganizationUser,
	createOrganizationOrganization,
	createOrganizationAvatar,
	createOrganizationRole,
	readOwnUser,
	readOwnOrganization,
	readOwnAvatar,
	readOwnRole,
	readOrganizationUser,
	readOrganizationOrganization,
	readOrganizationAvatar,
	readOrganizationRole,
	updateOwnUser,
	updateOwnOrganization,
	updateOwnAvatar,
	updateOwnRole,
	updateOrganizationUser,
	updateOrganizationOrganization,
	updateOrganizationAvatar,
	updateOrganizationRole,
	deleteOwnUser,
	deleteOwnOrganization,
	deleteOwnAvatar,
	deleteOwnRole,
	deleteOrganizationUser,
	deleteOrganizationOrganization,
	deleteOrganizationAvatar,
	deleteOrganizationRole,
} as const

export type PermissionKey =
	(typeof Permissions)[keyof typeof Permissions]['key']
