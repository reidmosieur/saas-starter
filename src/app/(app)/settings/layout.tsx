import { UserSettingsTabs } from '@/components/user-settings-tabs'

export default function Layout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<main className="space-y-4 p-4 md:space-y-6 md:p-6">
			<div>
				<h1>Settings</h1>
				<p>Make changes to your account, security, and other information</p>
			</div>
			<UserSettingsTabs>{children}</UserSettingsTabs>
		</main>
	)
}
