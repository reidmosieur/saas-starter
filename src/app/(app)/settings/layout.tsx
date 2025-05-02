import { SettingsTabs } from '@/components/settings-tabs'

export default function Layout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<main className="space-y-4 p-4 md:space-y-6 md:p-6">
			<div>
				<h1>Settings</h1>
				<p>Make changes to your account, billing, and other information</p>
			</div>
			<SettingsTabs>{children}</SettingsTabs>
		</main>
	)
}
