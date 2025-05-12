"use client";

import { IconInnerShadowTop } from '@tabler/icons-react'
import * as React from 'react'

import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from '@/components/ui/sidebar'
import {
	organizationSettingsRoute,
	rootRoute,
	settingsRoute,
} from '@/constants/routes'
import { useOrganization } from '@/context/organization'
import { IconDashboard } from '@tabler/icons-react'
import { BriefcaseBusiness, SettingsIcon } from 'lucide-react'
import Link from 'next/link'
import { NavMain } from './nav-main'
import { NavSecondary } from './nav-secondary'
import { NavUser } from './nav-user'

const navMain = [
	{
		title: 'Dashboard',
		url: rootRoute,
		icon: IconDashboard,
	},
]
const navSecondary = [
	{
		title: 'Organization',
		url: organizationSettingsRoute,
		icon: BriefcaseBusiness,
	},
	{
		title: 'Settings',
		url: settingsRoute,
		icon: SettingsIcon,
	},
]

export function AppSidebar({
	permittedRoutes,
	...props
}: React.ComponentProps<typeof Sidebar> & {
	permittedRoutes: Array<string>
}) {
	const { organization } = useOrganization()
	const filteredNavMain = navMain.filter(({ url }) =>
		permittedRoutes.includes(url),
	)
	const filteredNavSecondary = navSecondary.filter(({ url }) =>
		permittedRoutes.includes(url),
	)
	return (
		<Sidebar collapsible="offcanvas" {...props}>
			<SidebarHeader>
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton
							asChild
							className="data-[slot=sidebar-menu-button]:!p-1.5"
						>
							<Link href="/" className="text-foreground">
								<IconInnerShadowTop className="!size-5" />
								<span className="text-base font-semibold">
									{organization?.name}
								</span>
							</Link>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarHeader>
			<SidebarContent>
				<NavMain items={filteredNavMain} />
				<NavSecondary items={filteredNavSecondary} className="mt-auto" />
			</SidebarContent>
			<SidebarFooter>
				<NavUser permitted={permittedRoutes} />
			</SidebarFooter>
		</Sidebar>
	)
}
