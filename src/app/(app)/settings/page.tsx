import { getUserFromSession } from '@/app/actions/user'
import {
	PersonalInfoSettingsForm,
	AvatarSettingsForm,
	EmailSettingsForm,
	PhonenumberSettingsForm,
} from '@/components/account/settings'
import { TabsContent } from '@/components/ui/tabs'
import { redirect } from 'next/navigation'

export default async function Page() {
	const user = await getUserFromSession({
		firstName: true,
		lastName: true,
		username: true,
		email: true,
		phoneNumber: {
			select: {
				countryCode: true,
				number: true,
			},
		},
		avatar: {
			select: {
				src: true,
			},
		},
	})

	if (!user) {
		redirect('/logout')
	}

	const { firstName, lastName, username, email, phoneNumber, avatar } = user

	return (
		<TabsContent value="account" className="py-4 md:py-6">
			<section className="grid grid-cols-6 gap-4 md:gap-6">
				<PersonalInfoSettingsForm
					cardProps={{ className: 'col-span-2 h-fit' }}
					defaultValues={{
						firstName: firstName ?? '',
						lastName: lastName ?? '',
						username: username ?? '',
					}}
				/>
				<div className="col-span-2 grid gap-4 md:gap-6">
					<EmailSettingsForm defaultValues={{ email }} />
					<PhonenumberSettingsForm
						defaultValues={{
							countryCode: phoneNumber?.countryCode,
							phoneNumber: phoneNumber?.number,
						}}
					/>
				</div>
				<AvatarSettingsForm
					cardProps={{ className: 'col-span-2' }}
					currentImage={avatar?.src}
				/>
			</section>
		</TabsContent>
	)
}
