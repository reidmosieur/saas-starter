import { checkUserPermissions } from '@/lib/access-control'
import {
	OrganizationInfoSettingsForm,
	OrganizationRoles,
	OrganizationUsers,
} from '@/components/organization/settings'
import { TabsContent } from '@/components/ui/tabs'
import { redirect } from 'next/navigation'
import { constructRequiredPermissions } from '@/lib/utils'
import {
	readOrganizationOrganization,
	readOrganizationRole,
	readOrganizationUser,
	updateOrganizationRole,
	updateOrganizationUser,
} from '@/constants/permissions'
import { logoutRoute, rootRoute } from '@/constants/routes'

const requiredPermissions = constructRequiredPermissions([
	readOrganizationOrganization,
	readOrganizationUser,
])
const additionalSelect = {
	organization: {
		select: {
			name: true,
			users: {
				select: {
					firstName: true,
					lastName: true,
					email: true,
					roles: true,
					onboarded: true,
					suspended: true,
					invitedAt: true,
				},
			},
			roles: {
				select: {
					id: true,
					name: true,
					users: {
						select: {
							firstName: true,
							lastName: true,
						},
						take: 2,
					},
					permissions: {
						select: {
							name: true,
						},
						take: 2,
					},
					_count: {
						select: {
							users: true,
							permissions: true,
						},
					},
				},
				orderBy: {
					createdAt: 'asc',
				},
			},
		},
	},
}

export default async function Page() {
	const { permitted, user, permissions } = await checkUserPermissions({
		requiredPermissions,
		additionalSelect,
	})

	if (!permitted) {
		redirect(rootRoute)
	}

	if (!user) {
		redirect(logoutRoute)
	}

	// this is weird, the user should have permissions
	if (!permissions || !permissions.size) {
		// optional: log that something weird happened
		redirect(rootRoute)
	}

	// user can view organization users but not update them
	// this could become more granular with a createOrganizationUser
	// check then remove the "Invite user" button but keep the vertical
	// ellipsis edit button
	const readOnlyUsersTable =
		permissions.has(readOrganizationUser.key) &&
		!permissions.has(updateOrganizationUser.key)

	// similar logic to make role table read only
	// just for roles
	const readOnlyRolesTable =
		permissions.has(readOrganizationRole.key) &&
		!permissions.has(updateOrganizationRole.key)

	return (
		<TabsContent value="general" className="py-4 md:py-6">
			<section className="grid grid-cols-6 gap-4 md:gap-6">
				<OrganizationInfoSettingsForm
					cardProps={{ className: 'col-span-2 h-fit' }}
					defaultValues={{
						name: user?.organization?.name,
					}}
				/>
				<OrganizationUsers
					cardProps={{ className: 'col-span-4' }}
					users={user.organization?.users}
					readOnly={readOnlyUsersTable}
					roles={user.organization?.roles}
				/>
				<OrganizationRoles
					cardProps={{ className: 'col-span-4' }}
					roles={user.organization?.roles}
					readOnly={readOnlyRolesTable}
				/>
			</section>
		</TabsContent>
	)
}
