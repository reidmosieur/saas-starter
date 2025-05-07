import { GalleryVerticalEnd } from 'lucide-react'

import {
	Onboarding,
	OnboardingStep,
	OnboardingSteps,
} from '@/components/account/onboarding'
import { appName } from '@/data/app'
import Link from 'next/link'

export default async function Page({
	params,
}: {
	params: Promise<{ slug: OnboardingSteps }>
}) {
	const { slug } = await params
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
				<Onboarding slug={slug}>
					<OnboardingStep slug={slug} />
				</Onboarding>
			</div>
		</div>
	)
}
