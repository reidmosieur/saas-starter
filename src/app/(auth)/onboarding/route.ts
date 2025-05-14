import { getUserFromSession } from '@/app/actions/user'
import { onboardingRoute } from '@/constants/routes'
import { getCurrentOnboardingSlug, stringConcatenator } from '@/lib/utils'
import { redirect } from 'next/navigation'

export async function GET() {
	const user = await getUserFromSession({
		onboarding: { select: { currentStep: true } },
	})

	const currentStep = user?.onboarding?.currentStep

	if (!currentStep) {
		// todo: create a constructor that creates onboarding based
		// on missing user information
		throw new Error('Current step is missing')
	}

	const slug = getCurrentOnboardingSlug(currentStep)

	redirect(stringConcatenator([onboardingRoute, slug], '/'))
}
