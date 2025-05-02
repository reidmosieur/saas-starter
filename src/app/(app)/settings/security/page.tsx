import {
	OAuthSettingsForm,
	PasswordSettingsForm,
} from '@/components/auth/settings'
import { TabsContent } from '@/components/ui/tabs'

export default function Page() {
	return (
		<TabsContent value="security" className="py-4 md:py-6">
			<section className="grid grid-cols-6 gap-4 md:gap-6">
				<PasswordSettingsForm cardProps={{ className: 'col-span-2' }} />
				<OAuthSettingsForm cardProps={{ className: 'col-span-2' }} />
			</section>
		</TabsContent>
	)
}
