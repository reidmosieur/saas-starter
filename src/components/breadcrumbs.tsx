'use client'

import React, { Fragment, HTMLAttributes, ReactNode } from 'react'

import { cn } from '@/lib/utils'
import { ChevronRight, Home } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

type BreadcrumbsProps = {
	homeElement?: ReactNode
	separator?: ReactNode
	containerProps?: HTMLAttributes<HTMLUListElement>
	containerClasses?: string
	capitalizeLabel?: boolean
}

const Breadcrumbs = ({
	homeElement = <Home className="size-4" />,
	separator = <ChevronRight className="size-4" />,
	containerProps,
	capitalizeLabel = true,
}: BreadcrumbsProps) => {
	const paths = usePathname()
	const pathNames = paths.split('/').filter((path) => path)

	const PathBreadcrumb = ({ path, index }: { path: string; index: number }) => {
		const href = `/${pathNames.slice(0, index + 1).join('/')}`
		const label = path.replaceAll('-', ' ').replaceAll('_', ' ')

		return (
			<Fragment key={index}>
				{separator}
				<li className={cn(capitalizeLabel ? 'capitalize' : null)}>
					<Link href={href} className="w-[15px] truncate">
						{label}
					</Link>
				</li>
			</Fragment>
		)
	}

	return (
		<ul
			{...containerProps}
			className={cn('flex items-center gap-2', containerProps?.className)}
		>
			<li>
				<Link href={'/'}>{homeElement}</Link>
			</li>
			{pathNames.map((path, index) => (
				<PathBreadcrumb key={index} path={path} index={index} />
			))}
		</ul>
	)
}

export default Breadcrumbs
