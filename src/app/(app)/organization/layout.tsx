import { OrganizationSettingsTabs } from '@/components/organizatoin-settings-tabs'

export default function Layout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<main className="space-y-4 p-4 md:space-y-6 md:p-6">
			<div>
				<h1>Organization</h1>
				<p>
					Make changes to your organizations information, billing, and more.
				</p>
			</div>
			<OrganizationSettingsTabs>{children}</OrganizationSettingsTabs>
		</main>
	)
}
