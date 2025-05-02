import {
	AccountSettingsForm,
	AvatarSettingsForm,
	EmailSettingsForm,
	PhonenumberSettingsForm,
} from '@/components/account/settings'
import { TabsContent } from '@/components/ui/tabs'

export default function Page() {
	return (
		<TabsContent value="account" className="py-4 md:py-6">
			<section className="grid grid-cols-6 gap-4 md:gap-6">
				<AccountSettingsForm cardProps={{ className: 'col-span-2' }} />
				<div className="col-span-2 grid gap-4 md:gap-6">
					<EmailSettingsForm />
					<PhonenumberSettingsForm />
				</div>
				<AvatarSettingsForm cardProps={{ className: 'col-span-2' }} />
			</section>
		</TabsContent>
	)
}
