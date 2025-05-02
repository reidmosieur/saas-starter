'use client'

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ReactNode } from 'react'

export function OrganizationSettingsTabs({
	children,
}: {
	children?: ReactNode
}) {
	const pathname = usePathname()
	const scrubbedPathname = pathname
		.replace('/organization', '')
		.replaceAll('/', '')
	const defaultValue = scrubbedPathname === '' ? 'general' : scrubbedPathname
	return (
		// the key is critical to allow the Tabs to rerender when the user navigates outside of the TabsList
		// eg: in breadcrumbs
		<Tabs key={pathname} defaultValue={defaultValue}>
			<TabsList className="w-full">
				<TabsTrigger value="general" asChild>
					<Link href={'/organization'}>General</Link>
				</TabsTrigger>
				<TabsTrigger value="billing" asChild>
					<Link href={'/organization/billing'}>Billling</Link>
				</TabsTrigger>
				<TabsTrigger value="invoices" asChild>
					<Link href={'/organization/invoices'}>Invoices</Link>
				</TabsTrigger>
			</TabsList>
			{children}
		</Tabs>
	)
}
