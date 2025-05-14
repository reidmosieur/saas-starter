import { OnboardingSlugs } from '@/components/account/onboarding'
import { OnboardingSteps } from '@/generated/prisma'

export const onboardingSteps: Array<{
	id: OnboardingSteps
	slug: OnboardingSlugs
	label: string
}> = [
	{
		id: 'CREDENTIALS',
		slug: 'credentials',
		label: 'Credentials',
	},
	{
		id: 'USERNAME',
		slug: 'username',
		label: 'Username',
	},
	{
		id: 'PERSONAL_INFO',
		slug: 'personal-info',
		label: 'Your Info',
	},
	{
		id: 'ORGANIZATION',
		slug: 'organization',
		label: 'Organization Info',
	},
]
