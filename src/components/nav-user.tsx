"use client";

import {
	IconCreditCard,
	IconDotsVertical,
	IconLogout,
	IconUserCircle,
} from '@tabler/icons-react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	useSidebar,
} from '@/components/ui/sidebar'
import Link from 'next/link'
import React from 'react'

export function NavUser({
	firstName,
	lastName,
	email,
	avatar,
}: {
	firstName: string | null
	lastName: string | null
	email: string | null
	avatar?: {
		src: string
	}
}) {
	const { isMobile } = useSidebar()
	const name = `${firstName} ${lastName}`
	const fallback =
		firstName && lastName ? firstName.at(0)! + lastName.at(0)! : 'UN'

	return (
		<SidebarMenu>
			<SidebarMenuItem>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<SidebarMenuButton
							size="lg"
							className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
						>
							<Avatar className="h-8 w-8 rounded-lg">
								<AvatarImage
									className="object-cover"
									src={avatar?.src}
									alt={
										firstName || lastName ? `${firstName} ${lastName}` : 'User'
									}
								/>
								<AvatarFallback className="rounded-lg">
									{fallback}
								</AvatarFallback>
							</Avatar>
							<div className="grid flex-1 text-left text-sm leading-tight">
								<span className="truncate font-medium">
									{firstName && lastName
										? `${firstName} ${lastName}`
										: 'Username'}
								</span>
								{email ? (
									<span className="text-muted-foreground truncate text-xs">
										{email}
									</span>
								) : null}
							</div>
							<IconDotsVertical className="ml-auto size-4" />
						</SidebarMenuButton>
					</DropdownMenuTrigger>
					<DropdownMenuContent
						className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
						side={isMobile ? 'bottom' : 'right'}
						align="end"
						sideOffset={4}
					>
						<DropdownMenuLabel className="p-0 font-normal">
							<div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
								<Avatar className="h-8 w-8 rounded-lg">
									<AvatarImage
										src={avatar?.src}
										alt={name}
										className="object-cover"
									/>
									<AvatarFallback className="rounded-lg">
										{fallback}
									</AvatarFallback>
								</Avatar>
								<div className="grid flex-1 text-left text-sm leading-tight">
									<span className="truncate font-medium">{name}</span>
									<span className="text-muted-foreground truncate text-xs">
										{email}
									</span>
								</div>
							</div>
						</DropdownMenuLabel>
						<DropdownMenuSeparator />
						<DropdownMenuGroup>
							<DropdownMenuItem asChild>
								<Link className="text-foreground" href={'/settings'}>
									<IconUserCircle />
									Account
								</Link>
							</DropdownMenuItem>
							<DropdownMenuItem asChild>
								<Link
									className="text-foreground"
									href={'/organization/billing'}
								>
									<IconCreditCard />
									Billing
								</Link>
							</DropdownMenuItem>
						</DropdownMenuGroup>
						<DropdownMenuSeparator />
						<DropdownMenuItem asChild>
							<Link href={'/logout'} className="text-foreground">
								<IconLogout />
								Log out
							</Link>
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</SidebarMenuItem>
		</SidebarMenu>
	)
}
