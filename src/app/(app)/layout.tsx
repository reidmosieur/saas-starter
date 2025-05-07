import { AppSidebar } from '@/components/app-sidebar'
import { NavUser } from '@/components/nav-user'
import { SiteHeader } from '@/components/site-header'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { handleUserInitialization } from '../actions/user'

export default async function Layout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	const user = await handleUserInitialization()

	return (
		<SidebarProvider
			style={
				{
					'--sidebar-width': 'calc(var(--spacing) * 72)',
					'--header-height': 'calc(var(--spacing) * 12)',
				} as React.CSSProperties
			}
		>
			<AppSidebar variant="inset" navUser={<NavUser {...user} />} />
			<SidebarInset>
				<SiteHeader />
				{children}
			</SidebarInset>
		</SidebarProvider>
	)
}
