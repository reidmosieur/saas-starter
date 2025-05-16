import { instantiateBillingSettings } from '@/app/actions/stripe'
import { BillingContextProvider } from '@/components/billing/context'
import { BillingAddressSettingsForm } from '@/components/billing/settings/billing-addresses'
import { PaymentMethodSettingsForm } from '@/components/billing/settings/payment-methods'
import { PlanSettingsForm } from '@/components/billing/settings/plan-settings'
import { ConditionalStripeElementsProvider } from '@/components/stripe-elements-provider'
import { StripeMissing } from '@/components/stripe-missing'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import {
	Card,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import { TabsContent } from '@/components/ui/tabs'
import { readOrganizationOrganization } from '@/constants/permissions'
import { hideStripeDependents } from '@/constants/setup'
import { checkUserPermissions } from '@/lib/access-control'
import { constructRequiredPermissions } from '@/lib/utils'
import { User } from 'lucide-react'
import { redirect } from 'next/navigation'

const requiredPermissions = constructRequiredPermissions([
	readOrganizationOrganization,
])
const additionalSelect = {
	organization: {
		select: {
			name: true,
			users: {
				select: {
					firstName: true,
					lastName: true,
					email: true,
					roles: true,
					createdAt: true,
				},
			},
			roles: {
				select: {
					name: true,
					users: {
						select: {
							firstName: true,
							lastName: true,
						},
						take: 2,
					},
					permissions: {
						select: {
							name: true,
						},
						take: 2,
					},
					_count: {
						select: {
							users: true,
							permissions: true,
						},
					},
				},
			},
			billingAddresses: true,
		},
	},
}

export default async function Page() {
	const { permitted, user } = await checkUserPermissions({
		requiredPermissions,
		additionalSelect,
	})

	if (!permitted) {
		redirect('/')
	}

	if (!user) {
		redirect('/logout')
	}

	const data = hideStripeDependents ? null : await instantiateBillingSettings()

	const { plans, setupIntent, cards, subscription } = data ?? {
		subscriptionId: 'sub_1234567890',
		subscriptionItemId: 'si_0987654321',
		currentPlan: 'price_123pro',
		setupIntent: {
			client_secret: undefined,
		},
		plans: [
			{
				name: 'pro',
				default_price: {
					id: 'price_123pro',
					unit_amount_decimal: '2000', // $20.00
					recurring: {
						interval: 'month',
					},
				},
			},
			{
				name: 'business',
				default_price: {
					id: 'price_456biz',
					unit_amount_decimal: '5000', // $50.00
					recurring: {
						interval: 'month',
					},
				},
			},
			{
				name: 'pro',
				default_price: {
					id: 'price_123proyear',
					unit_amount_decimal: '20000', // $200.00
					recurring: {
						interval: 'year',
					},
				},
			},
			{
				name: 'business',
				default_price: {
					id: 'price_456bizyear',
					unit_amount_decimal: '50000', // $500.00
					recurring: {
						interval: 'year',
					},
				},
			},
		],
		cards: [
			{
				id: 'card_abc123',
				brand: 'visa',
				exp_month: 12,
				exp_year: 2026,
				last4: '4242',
			},
			{
				id: 'card_def456',
				brand: 'mastercard',
				exp_month: 5,
				exp_year: 2025,
				last4: '5555',
			},
		],
	}

	const { client_secret } = setupIntent!

	const billingAddresses = user.organization?.billingAddresses

	return (
		<ConditionalStripeElementsProvider
			provideElements={!hideStripeDependents && Boolean(client_secret)}
			clientSecret={client_secret}
		>
			<BillingContextProvider
				defaultValues={{
					subscriptionId: subscription?.id ?? '',
					subscriptionItemId: subscription?.subscriptionItemId ?? '',
					currentPlan: subscription?.planId ?? '',
					plans,
					cards,
				}}
			>
				<TabsContent value="billing" className="py-4 md:py-6">
					<section className="grid grid-cols-1 gap-4 md:gap-6 xl:grid-cols-6">
						{!client_secret ? (
							<Alert>
								<User className="h-4 w-4" />
								<AlertTitle>Heads up!</AlertTitle>
								<AlertDescription>
									There is no customer associated with this user. Some or all of
									the data displayed is mocked.
								</AlertDescription>
							</Alert>
						) : null}
						<Card className="h-fit xl:col-span-2">
							<CardHeader>
								<CardTitle>Managed By Stripe </CardTitle>
								<CardDescription>
									All payments are fulfilled using Stripe. End-to-end
									encryption, fully secure.
								</CardDescription>
							</CardHeader>
						</Card>
						<PlanSettingsForm cardProps={{ className: 'xl:col-span-4' }} />
						<PaymentMethodSettingsForm
							cardProps={{ className: 'xl:col-span-2' }}
							clientSecret={client_secret}
							cards={cards}
						/>
						<BillingAddressSettingsForm
							cardProps={{ className: 'xl:col-span-2' }}
							billingAddresses={billingAddresses}
						/>
					</section>
				</TabsContent>
			</BillingContextProvider>
		</ConditionalStripeElementsProvider>
	)
}
