import { GalleryVerticalEnd } from 'lucide-react'

import { getUserFromSession } from '@/app/actions/user'
import {
	Onboarding,
	OnboardingStep,
	OnboardingSlugs,
} from '@/components/account/onboarding'
import { appName } from '@/data/app'
import Link from 'next/link'
import { onboardingSteps } from '@/constants/onboarding'
import { redirect } from 'next/navigation'
import { ConditionalStripeElementsProvider } from '@/components/stripe-elements-provider'
import { createSetupIntent } from '@/app/actions/stripe'

export default async function Page({
	params,
}: {
	params: Promise<{ slug: OnboardingSlugs }>
}) {
	const { slug } = await params
	const user = await getUserFromSession({
		organization: {
			select: {
				stripeCustomerId: true,
			},
		},
		onboarding: { select: { requiredSteps: true, currentStep: true } },
	})

	const currentStepSlug = onboardingSteps.find(
		({ id }) => user?.onboarding?.currentStep === id,
	)?.slug

	if (currentStepSlug && currentStepSlug !== slug) {
		redirect('/onboarding/' + currentStepSlug)
	}

	const customerId = user?.organization?.stripeCustomerId

	const isBillingStep = slug === 'billing'
	const stripeCustomerExists = Boolean(customerId)

	if (isBillingStep && !stripeCustomerExists) {
		console.log(
			'Something went wrong. A customer is onboarding for billing but their stripe customer ID is missing',
		)
		redirect('/login')
	}

	const instantiateStripeElements = isBillingStep && stripeCustomerExists
	const setupIntent = instantiateStripeElements
		? await createSetupIntent(customerId!)
		: null
	const clientSecret = setupIntent?.client_secret

	return (
		<ConditionalStripeElementsProvider
			provideElements={instantiateStripeElements}
			clientSecret={clientSecret}
		>
			<div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
				<div className="flex w-full max-w-prose flex-col gap-6">
					<Link
						href="/"
						className="flex items-center gap-2 self-center font-medium"
					>
						<div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
							<GalleryVerticalEnd className="size-4" />
						</div>
						{appName}
					</Link>
					<Onboarding
						slug={slug}
						requiredSteps={user?.onboarding?.requiredSteps}
					>
						<OnboardingStep slug={slug} />
					</Onboarding>
				</div>
			</div>
		</ConditionalStripeElementsProvider>
	)
}
