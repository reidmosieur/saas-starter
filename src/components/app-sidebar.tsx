"use client";

import { IconDashboard, IconInnerShadowTop } from "@tabler/icons-react";
import * as React from "react";

import { NavMain } from '@/components/nav-main'
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
import { BriefcaseBusiness, SettingsIcon } from 'lucide-react'
import Link from 'next/link'
import { NavSecondary } from './nav-secondary'

const data = {
	user: {
		name: 'Reid Mosieur',
		email: 'rmosieur@gmail.com',
		avatar: '/avatars/reid.jpg',
		fallback: 'RM',
	},
	navMain: [
		{
			title: 'Dashboard',
			url: '/',
			icon: IconDashboard,
		},
	],
	navSecondary: [
		{
			title: 'Organization',
			url: '/organization',
			icon: BriefcaseBusiness,
		},
		{
			title: 'Settings',
			url: '/settings',
			icon: SettingsIcon,
		},
	],
}

export function AppSidebar({
	navUser,
	...props
}: React.ComponentProps<typeof Sidebar> & {
	navUser: React.ReactNode
}) {
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
				<NavMain items={data.navMain} />
				<NavSecondary items={data.navSecondary} className="mt-auto" />
			</SidebarContent>
			<SidebarFooter>{navUser}</SidebarFooter>
		</Sidebar>
	)
}
