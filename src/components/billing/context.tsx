'use client'

import {
	createContext,
	Dispatch,
	ReactNode,
	SetStateAction,
	useContext,
	useState,
} from 'react'
import Stripe from 'stripe'

type BillingPlans = Array<
	| {
			name: string
			default_price?: undefined
	  }
	| {
			name: string
			default_price: {
				id: string
				unit_amount_decimal: string | null
				recurring: {
					interval: Stripe.Price.Recurring.Interval | undefined
				}
			}
	  }
>

type BillingCards = Array<{
	id: string
	brand: string
	exp_month: number
	exp_year: number
	last4: string
}>

interface BillingContext {
	subscriptionId: string
	currentPlan: string
	subscriptionItemId: string
	plans: BillingPlans
	setPlans: Dispatch<SetStateAction<BillingPlans>>
	cards: BillingCards
	setCards: Dispatch<SetStateAction<BillingCards>>
}

export const BillingContext = createContext<BillingContext | null>(null)

interface BillingContextDefaultValues {
	subscriptionId: string
	subscriptionItemId: string
	currentPlan: string
	plans: BillingPlans
	cards: BillingCards
}

export function BillingContextProvider({
	defaultValues,
	children,
}: {
	defaultValues: BillingContextDefaultValues
	children?: ReactNode
}) {
	const [plans, setPlans] = useState<BillingPlans>(defaultValues.plans)
	const [cards, setCards] = useState<BillingCards>(defaultValues.cards)

	return (
		<BillingContext
			value={{
				subscriptionId: defaultValues.subscriptionId,
				subscriptionItemId: defaultValues.subscriptionItemId,
				currentPlan: defaultValues.currentPlan,
				plans,
				setPlans,
				cards,
				setCards,
			}}
		>
			{children}
		</BillingContext>
	)
}

export function useBilling() {
	const context = useContext(BillingContext)
	if (context === null) {
		throw new Error('useBilling must be used within a BillingProvider')
	}
	return context
}
