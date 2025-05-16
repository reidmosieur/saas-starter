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
import { OnboardingSteps } from '@/generated/prisma'
import { UsernameOnboardingStep } from './username'
import { CredentialsOnboardingStep } from './credentials'
import { onboardingSteps } from '@/constants/onboarding'
import { BillingOnboardingStep } from './billing'

export function Onboarding({
	className,
	children,
	heading = 'Welcome',
	description = 'Continue setting up your account',
	slug,
	requiredSteps = ['CREDENTIALS', 'PERSONAL_INFO', 'ORGANIZATION'],
	...props
}: React.ComponentProps<'div'> & {
	heading?: string
	description?: string
	slug: string
	requiredSteps?: Array<OnboardingSteps>
}) {
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
							{onboardingSteps
								.filter(({ id }) => requiredSteps.includes(id))
								.map(({ slug, label }, index, filteredSteps) => {
									const completed = index < currentStep
									const current = index === currentStep
									const isLast = index === filteredSteps.length - 1

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
											{!isLast && (
												<Separator
													orientation="horizontal"
													className={cn(
														'min-w-5 grow data-[orientation=horizontal]:w-fit',
														completed && 'bg-primary',
													)}
												/>
											)}
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

export type OnboardingSlugs =
	| 'credentials'
	| 'username'
	| 'personal-info'
	| 'organization'
	| 'billing'

export function OnboardingStep({ slug }: { slug: OnboardingSlugs }) {
	switch (slug) {
		// Step 1:
		// credentials step is at /onboarding
		case 'credentials':
			return <CredentialsOnboardingStep />

		case 'username':
			return <UsernameOnboardingStep />

		// Step 2:
		case 'personal-info':
			return <PersonalInfoOnboardingStep />

		// Step 3:
		case 'organization':
			return <OrganizationOnboardingStep />

		// Step 4:
		case 'billing':
			return <BillingOnboardingStep />

		default:
			redirect('/onboarding')
	}
}
