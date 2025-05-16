import { instantiateBillingSettings } from '@/app/actions/stripe'
import { BillingContextProvider } from '@/components/billing/context'
import { BillingAddressSettingsForm } from '@/components/billing/settings/billing-addresses'
import { PaymentMethodSettingsForm } from '@/components/billing/settings/payment-methods'
import { PlanSettingsForm } from '@/components/billing/settings/plan-settings'
import { StripeElementsProvider } from '@/components/stripe-elements-provider'
import {
	Card,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import { TabsContent } from '@/components/ui/tabs'
import { readOrganizationOrganization } from '@/constants/permissions'
import { checkUserPermissions } from '@/lib/access-control'
import { constructRequiredPermissions } from '@/lib/utils'
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

	const data = await instantiateBillingSettings()

	if (!data) {
		return <p>Something went wrong</p>
	}

	const { plans, setupIntent, cards, subscription, billingAddresses } = data

	const { client_secret } = setupIntent

	return (
		<StripeElementsProvider clientSecret={client_secret}>
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
					<section className="grid grid-cols-6 gap-4 md:gap-6">
						<Card className="col-span-2 h-fit">
							<CardHeader>
								<CardTitle>Managed By Stripe</CardTitle>
								<CardDescription>
									All payments are fulfilled using Stripe. End-to-end
									encryption, fully secure.
								</CardDescription>
							</CardHeader>
						</Card>
						<PlanSettingsForm cardProps={{ className: 'col-span-4' }} />
						<PaymentMethodSettingsForm
							cardProps={{ className: 'col-span-2' }}
							clientSecret={client_secret}
							cards={cards}
						/>
						<BillingAddressSettingsForm
							cardProps={{ className: 'col-span-2' }}
							billingAddresses={billingAddresses}
						/>
					</section>
				</TabsContent>
			</BillingContextProvider>
		</StripeElementsProvider>
	)
}
