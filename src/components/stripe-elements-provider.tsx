'use client'

import { Fragment, ReactNode } from 'react'
import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import { useTheme } from 'next-themes'
import { hideStripeDependents } from '@/constants/setup'

const stripePromise = loadStripe(
	process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? '',
)

interface StripeElementsProviderProps {
	children?: ReactNode
	clientSecret?: string | null
}

export function StripeElementsProvider({
	children,
	clientSecret,
}: StripeElementsProviderProps) {
	const { resolvedTheme } = useTheme()

	return (
		<Elements
			stripe={stripePromise}
			options={{
				clientSecret: clientSecret ?? '',
				appearance: {
					theme: resolvedTheme === 'dark' ? 'flat' : 'stripe',
				},
			}}
		>
			{children}
		</Elements>
	)
}

export function ConditionalStripeElementsProvider({
	provideElements,
	children,
	...props
}: StripeElementsProviderProps & {
	provideElements?: boolean
}) {
	return provideElements ? (
		<StripeElementsProvider {...props}>{children}</StripeElementsProvider>
	) : (
		<Fragment>{children}</Fragment>
	)
}
