import { GalleryVerticalEnd } from 'lucide-react'

import { Onboarding } from '@/components/account/onboarding'
import { CredentialsOnboardingStep } from '@/components/account/onboarding/credentials'
import { appName } from '@/data/app'
import Link from 'next/link'
import { getUserFromSession } from '@/app/actions/user'

export default async function Page() {
	const user = await getUserFromSession({
		onboarding: { select: { requiredSteps: true } },
	})
	return (
		<div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
			<div className="flex w-full max-w-md flex-col gap-6">
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
					slug="credentials"
					requiredSteps={user?.onboarding?.requiredSteps}
				>
					<CredentialsOnboardingStep />
				</Onboarding>
			</div>
		</div>
	)
}
