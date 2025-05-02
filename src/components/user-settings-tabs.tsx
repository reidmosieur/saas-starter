'use client'

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ReactNode } from 'react'

export function UserSettingsTabs({ children }: { children?: ReactNode }) {
	const pathname = usePathname()
	const scrubbedPathname = pathname.replace('/settings', '').replaceAll('/', '')
	const defaultValue = scrubbedPathname === '' ? 'account' : scrubbedPathname
	return (
		// the key is critical to allow the Tabs to rerender when the user navigates outside of the TabsList
		// eg: in breadcrumbs
		<Tabs key={pathname} defaultValue={defaultValue}>
			<TabsList className="w-full">
				<TabsTrigger value="account" asChild>
					<Link href={'/settings'}>General</Link>
				</TabsTrigger>
				<TabsTrigger value="security" asChild>
					<Link href={'/settings/security'}>Security & Privacy</Link>
				</TabsTrigger>
			</TabsList>
			{children}
		</Tabs>
	)
}
