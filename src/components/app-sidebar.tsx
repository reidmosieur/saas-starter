"use client";

import { IconDashboard, IconInnerShadowTop } from "@tabler/icons-react";
import * as React from "react";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { SettingsIcon } from "lucide-react";
import { NavSecondary } from "./nav-secondary";
import Link from "next/link";
import { appName } from "@/data/app";

const data = {
	user: {
		name: 'reid',
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
			title: 'Settings',
			url: '/settings',
			icon: SettingsIcon,
		},
	],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
		<Sidebar collapsible="offcanvas" {...props}>
			<SidebarHeader>
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton
							asChild
							className="data-[slot=sidebar-menu-button]:!p-1.5"
						>
							<Link href="#" className="text-foreground">
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
			<SidebarFooter>
				<NavUser user={data.user} />
			</SidebarFooter>
		</Sidebar>
	)
}
