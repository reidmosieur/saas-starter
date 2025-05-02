import {
	OrganizationRoles,
	OrganizationSettingsForm,
	OrganizationUsers,
} from '@/components/organization/settings'
import { TabsContent } from '@/components/ui/tabs'

export default function Page() {
	return (
		<TabsContent value="general" className="py-4 md:py-6">
			<section className="grid grid-cols-6 gap-4 md:gap-6">
				<OrganizationSettingsForm cardProps={{ className: 'col-span-2' }} />
				<OrganizationUsers cardProps={{ className: 'col-span-4' }} />
				<OrganizationRoles cardProps={{ className: 'col-span-4' }} />
			</section>
		</TabsContent>
	)
}
