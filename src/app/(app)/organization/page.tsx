import { checkUserPermissions } from '@/lib/access-control'
import {
	OrganizationInfoSettingsForm,
	OrganizationRoles,
	OrganizationUsers,
} from '@/components/organization/settings'
import { TabsContent } from '@/components/ui/tabs'
import { redirect } from 'next/navigation'
import { constructRequiredPermissions } from '@/lib/utils'
import { readOrganizationOrganization } from '@/constants/permissions'

const requiredPermissions = constructRequiredPermissions([
	readOrganizationOrganization,
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
					createdAt: true,
				},
			},
			roles: {
				select: {
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
			},
		},
	},
}

export default async function Page() {
	const { permitted, permissions, user } = await checkUserPermissions({
		requiredPermissions,
		additionalSelect,
	})

	if (!permitted) {
		redirect('/')
	}

	if (!user) {
		redirect('/logout')
	}

	return (
		<TabsContent value="general" className="py-4 md:py-6">
			<section className="grid grid-cols-6 gap-4 md:gap-6">
				<pre className="col-span-6 whitespace-pre-wrap">
					{JSON.stringify(permissions)}
				</pre>
				<OrganizationInfoSettingsForm
					cardProps={{ className: 'col-span-2 h-fit' }}
					defaultValues={{
						name: user?.organization?.name,
					}}
				/>
				<OrganizationUsers
					cardProps={{ className: 'col-span-4' }}
					users={user.organization?.users}
				/>
				<OrganizationRoles
					cardProps={{ className: 'col-span-4' }}
					roles={user.organization?.roles}
				/>
			</section>
		</TabsContent>
	)
}
