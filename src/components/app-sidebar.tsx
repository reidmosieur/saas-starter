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
import { appName } from '@/data/app'
import Link from 'next/link'
import { NavUser } from './nav-user'
import { organizationSettings, root, settings } from '@/constants/routes'
import { IconDashboard } from '@tabler/icons-react'
import { BriefcaseBusiness, SettingsIcon } from 'lucide-react'
import { NavMain } from './nav-main'
import { NavSecondary } from './nav-secondary'

const navMain = [
	{
		title: 'Dashboard',
		url: root,
		icon: IconDashboard,
	},
]
const navSecondary = [
	{
		title: 'Organization',
		url: organizationSettings,
		icon: BriefcaseBusiness,
	},
	{
		title: 'Settings',
		url: settings,
		icon: SettingsIcon,
	},
]

export function AppSidebar({
	permittedRoutes,
	...props
}: React.ComponentProps<typeof Sidebar> & {
	permittedRoutes: Array<string>
}) {
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
								<span className="text-base font-semibold">{appName}</span>
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
				<NavUser />
			</SidebarFooter>
		</Sidebar>
	)
}
