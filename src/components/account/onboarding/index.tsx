'use client'

import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbList,
} from '@/components/ui/breadcrumb'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import { redirect } from 'next/navigation'
import { OrganizationOnboardingStep } from './organization'
import { PersonalInfoOnboardingStep } from './personal-info'
import { Fragment } from 'react'

const onboardingSteps = [
	{
		slug: 'credentials',
		label: 'Credentials',
	},
	{
		slug: 'personal-info',
		label: 'Your Info',
	},
	{
		slug: 'organization',
		label: 'Organization Info',
	},
]

export function Onboarding({
	className,
	children,
	heading = 'Welcome',
	description = 'Continue setting up your account',
	slug,
	...props
}: React.ComponentProps<'div'> & {
	heading?: string
	description?: string
	slug: string
}) {
	const onboardingStepsLength = onboardingSteps.length
	const currentStep = onboardingSteps.findIndex(
		({ slug: stepSlug }) => stepSlug === slug,
	)

	return (
		<div className={cn('flex flex-col gap-6', className)} {...props}>
			<Card>
				<CardHeader className="text-center">
					<CardTitle className="text-xl">
						<h1>{heading}</h1>
					</CardTitle>
					<CardDescription>{description}</CardDescription>
				</CardHeader>
				<CardContent className="mb-6 space-y-6">
					<Breadcrumb>
						<BreadcrumbList className="justify-between sm:gap-5">
							{onboardingSteps.map(({ slug, label }, index) => {
								const completed = index < currentStep
								const current = index === currentStep
								return (
									<Fragment key={slug}>
										<BreadcrumbItem
											className={cn(
												completed && 'text-primary',
												current && 'text-foreground',
											)}
										>
											{label}
										</BreadcrumbItem>
										{index < onboardingStepsLength - 1 ? (
											<Separator
												orientation="horizontal"
												className={cn(
													'grow data-[orientation=horizontal]:w-fit',
													completed && 'bg-primary',
												)}
											/>
										) : null}
									</Fragment>
								)
							})}
						</BreadcrumbList>
					</Breadcrumb>
					{children}
				</CardContent>
			</Card>
		</div>
	)
}

export type OnboardingSteps = 'credentials' | 'personal-info' | 'organization'

export function OnboardingStep({ slug }: { slug: OnboardingSteps }) {
	switch (slug) {
		// Step 1:
		// credentials step is at /onboarding
		case 'credentials':
		default:
			redirect('/onboarding')

		// Step 2:
		case 'personal-info':
			return <PersonalInfoOnboardingStep />

		// Step 3:
		case 'organization':
			return <OrganizationOnboardingStep />
	}
}
