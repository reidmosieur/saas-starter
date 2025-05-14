import {
	OAuthSettingsForm,
	PasswordSettingsForm,
	SessionsTable,
} from '@/components/auth/settings'
import { TabsContent } from '@/components/ui/tabs'
import { readOwnUser } from '@/constants/permissions'
import { checkUserPermissions } from '@/lib/access-control'
import { readSessionId } from '@/lib/session'
import { constructRequiredPermissions } from '@/lib/utils'
import { redirect } from 'next/navigation'

const requiredPermissions = constructRequiredPermissions([readOwnUser])
const additionalSelect = {
	firstName: true,
	lastName: true,
	username: true,
	phoneNumber: true,
	avatar: true,
	sessions: {
		where: {
			revokedAt: null,
		},
	},
}

export default async function Page() {
	const { permitted, user } = await checkUserPermissions({
		requiredPermissions,
		additionalSelect,
	})

	const sessionId = await readSessionId()

	if (!permitted) {
		redirect('/')
	}

	if (!user || !sessionId) {
		redirect('/logout')
	}

	return (
		<TabsContent value="security" className="py-4 md:py-6">
			<section className="grid grid-cols-6 gap-4 md:gap-6">
				<PasswordSettingsForm cardProps={{ className: 'col-span-2' }} />
				<OAuthSettingsForm cardProps={{ className: 'col-span-2' }} />
				<SessionsTable
					cardProps={{ className: 'col-span-6' }}
					sessions={user.sessions}
					currentSession={sessionId}
				/>
			</section>
		</TabsContent>
	)
}
