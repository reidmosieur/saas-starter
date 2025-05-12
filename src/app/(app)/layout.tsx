import { AppSidebar } from '@/components/app-sidebar'
import { SiteHeader } from '@/components/site-header'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { UserContextProvider } from '@/context/user'
import { handleUserInitialization } from '../actions/user'
import { constructNavigation } from '@/lib/access-control'
import { OrganizationContextProvider } from '@/context/organization'

export default async function Layout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	const user = await handleUserInitialization()
	const permittedRoutes = await constructNavigation()

	return (
		<UserContextProvider defaultValues={user}>
			<OrganizationContextProvider defaultValues={user.organization}>
				<SidebarProvider
					style={
						{
							'--sidebar-width': 'calc(var(--spacing) * 72)',
							'--header-height': 'calc(var(--spacing) * 12)',
						} as React.CSSProperties
					}
				>
					<AppSidebar variant="inset" permittedRoutes={permittedRoutes} />
					<SidebarInset>
						<SiteHeader />
						{children}
					</SidebarInset>
				</SidebarProvider>
			</OrganizationContextProvider>
		</UserContextProvider>
	)
}
