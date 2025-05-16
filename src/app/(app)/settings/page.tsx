import {
	AvatarSettingsForm,
	EmailSettingsForm,
	PersonalInfoSettingsForm,
	PhonenumberSettingsForm,
} from '@/components/account/settings'
import { TabsContent } from '@/components/ui/tabs'
import { readOwnUser } from '@/constants/permissions'
import { checkUserPermissions } from '@/lib/access-control'
import { constructRequiredPermissions } from '@/lib/utils'
import { redirect } from 'next/navigation'

const requiredPermissions = constructRequiredPermissions([readOwnUser])
const additionalSelect = {
	firstName: true,
	lastName: true,
	username: true,
	phoneNumber: true,
	avatar: true,
	email: true,
}

export default async function Page() {
	const { permitted, user } = await checkUserPermissions({
		requiredPermissions,
		additionalSelect,
	})

	if (!permitted) {
		redirect('/')
	}

	if (!user) {
		redirect('/logout')
	}

	const { firstName, lastName, username, email, phoneNumber, avatar } = user

	return (
		<TabsContent value="account" className="py-4 md:py-6">
			<section className="grid grid-cols-1 gap-4 md:gap-6 xl:grid-cols-6">
				<PersonalInfoSettingsForm
					cardProps={{ className: 'xl:col-span-2 h-fit' }}
					defaultValues={{
						firstName: firstName ?? '',
						lastName: lastName ?? '',
						username: username ?? '',
					}}
				/>
				<div className="grid gap-4 md:gap-6 xl:col-span-2">
					<EmailSettingsForm defaultValues={{ email }} />
					<PhonenumberSettingsForm
						defaultValues={{
							countryCode: phoneNumber?.countryCode,
							phoneNumber: phoneNumber?.number,
						}}
					/>
				</div>
				<AvatarSettingsForm
					cardProps={{ className: 'xl:col-span-2' }}
					currentImage={avatar?.src}
				/>
			</section>
		</TabsContent>
	)
}
